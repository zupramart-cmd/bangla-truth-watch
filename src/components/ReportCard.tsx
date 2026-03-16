import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, MapPin, ThumbsUp, ThumbsDown, HelpCircle, ExternalLink, X, Maximize2, Play, UserX } from 'lucide-react';
import { Report, VoteType } from '../types';
import { db, handleFirestoreError, OperationType, auth } from '../firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { generateNickname } from '../lib/nicknames';
import { getViralShareMessage } from '../lib/shareMessages';
import { getCorruptionIcon } from '../lib/corruptionIcons';

export default function ReportCard({ report }: { report: Report }) {
  const [hasVoted, setHasVoted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const nickname = generateNickname(report.id);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setIsAdmin(!!user));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const votedReports = JSON.parse(localStorage.getItem('votedReports') || '{}');
    if (votedReports[report.id]) setHasVoted(true);
  }, [report.id]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  const handleVote = async (e: React.MouseEvent, type: VoteType) => {
    e.stopPropagation();
    if (hasVoted && !isAdmin) return;
    try {
      const reportRef = doc(db, 'reports', report.id);
      const updateData: Record<string, ReturnType<typeof increment>> = {};
      if (type === 'true') updateData.votesTrue = increment(1);
      if (type === 'false') updateData.votesFalse = increment(1);
      if (type === 'needEvidence') updateData.votesNeedEvidence = increment(1);
      await updateDoc(reportRef, updateData);
      if (!isAdmin) {
        const votedReports = JSON.parse(localStorage.getItem('votedReports') || '{}');
        votedReports[report.id] = true;
        localStorage.setItem('votedReports', JSON.stringify(votedReports));
        setHasVoted(true);
      }
      triggerToast('আপনার ভোট সফলভাবে জমা হয়েছে!');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reports/${report.id}`);
      triggerToast('ভোট দিতে সমস্যা হয়েছে!');
    }
  };

  const shareReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/report/${report.id}`;
    const viralText = getViralShareMessage(report.title);
    if (navigator.share) {
      navigator.share({ title: report.title, text: viralText, url: shareUrl });
    } else {
      navigator.clipboard.writeText(`${viralText}\n${shareUrl}`);
      triggerToast('লিঙ্ক কপি হয়েছে!');
    }
  };

  const getYoutubeId = (url: string) => {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderMedia = (link: string, index: number) => {
    const ytId = getYoutubeId(link);
    if (ytId) {
      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedMedia(link); }}>
          <img src={`https://img.youtube.com/vi/${ytId}/0.jpg`} alt="Video" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play size={28} className="text-white fill-current ml-1" />
            </div>
          </div>
        </div>
      );
    }
    if (link.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center group cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedMedia(link); }}>
          <video className="w-full h-full object-cover opacity-60"><source src={link} /></video>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"><Play size={28} className="text-white fill-current ml-1" /></div>
          </div>
        </div>
      );
    }
    if (link.match(/\.(jpeg|jpg|gif|png|webp)$/i) || link.includes('i.ibb.co')) {
      return (
        <div className="relative w-full h-full cursor-pointer group" onClick={(e) => { e.stopPropagation(); setSelectedMedia(link); }}>
          <img src={link} alt={`Evidence ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 p-2 rounded-full text-white backdrop-blur-sm"><Maximize2 size={16} /></div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <ExternalLink size={32} className="text-gray-400 mb-2" />
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-red-600 font-medium underline break-all" onClick={(e) => e.stopPropagation()}>এভিডেন্স দেখুন</a>
      </div>
    );
  };

  const hasMedia = report.evidenceLinks && report.evidenceLinks.length > 0;

  return (
    <div className="bg-white overflow-hidden mb-2 md:mb-0 md:rounded-xl md:shadow-sm md:border md:border-gray-100 transition-all hover:shadow-md relative cursor-pointer active:bg-gray-50"
      onClick={() => navigate(`/report/${report.id}`)}>
      {showToast && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl animate-fade-in">
          {showToast}
        </div>
      )}

      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <UserX size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{nickname}</p>
              <p className="text-[11px] text-gray-400">{new Date(report.date).toLocaleDateString('bn-BD')}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full flex items-center gap-1">
            {getCorruptionIcon(report.corruptionType, 12)}
            {report.corruptionType}
          </span>
        </div>
      </div>

      <div className="px-4 pb-1">
        <h3 className="text-base font-bold text-gray-900 leading-snug">{report.title}</h3>
      </div>

      <div className="flex items-center text-gray-500 text-sm px-4 pb-3">
        <MapPin size={14} className="mr-1 text-red-400" />
        <span className="truncate">{report.locationName}</span>
      </div>

      {hasMedia && (
        <div className="w-full aspect-[16/9] bg-gray-100">
          <Swiper modules={[Autoplay, Pagination]} pagination={{ clickable: true }} autoplay={{ delay: 4000, disableOnInteraction: true }} className="h-full w-full">
            {report.evidenceLinks.map((link, index) => (
              <SwiperSlide key={index}>{renderMedia(link, index)}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {(report as any).actionStatus && (
        <div className="mx-4 mt-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-[11px] font-bold text-blue-700">পদক্ষেপ: {(report as any).actionStatus}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        <button onClick={(e) => handleVote(e, 'true')} disabled={hasVoted && !isAdmin}
          className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all active:scale-95 ${hasVoted && !isAdmin ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-green-50 border-green-100 text-green-700 hover:bg-green-100'}`}>
          <ThumbsUp size={18} />
          <span className="text-[10px] font-bold mt-1">সত্য ({report.votesTrue})</span>
        </button>
        <button onClick={(e) => handleVote(e, 'false')} disabled={hasVoted && !isAdmin}
          className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all active:scale-95 ${hasVoted && !isAdmin ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-red-50 border-red-100 text-red-700 hover:bg-red-100'}`}>
          <ThumbsDown size={18} />
          <span className="text-[10px] font-bold mt-1">মিথ্যা ({report.votesFalse})</span>
        </button>
        <button onClick={(e) => handleVote(e, 'needEvidence')} disabled={hasVoted && !isAdmin}
          className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all active:scale-95 ${hasVoted && !isAdmin ? 'bg-gray-50 border-gray-100 text-gray-400' : 'bg-yellow-50 border-yellow-100 text-yellow-700 hover:bg-yellow-100'}`}>
          <HelpCircle size={18} />
          <span className="text-[10px] font-bold mt-1">প্রমাণ চাই ({report.votesNeedEvidence})</span>
        </button>
      </div>

      <div className="flex justify-between items-center px-4 pb-3 border-t border-gray-50 pt-2">
        <div className="flex gap-4">
          <button onClick={shareReport} className="text-gray-400 hover:text-red-600 transition-colors active:scale-90"><Share2 size={20} /></button>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/map?id=${report.id}`); }} className="text-gray-400 hover:text-red-600 transition-colors active:scale-90"><MapPin size={20} /></button>
        </div>
        <span className="text-red-600 font-bold text-xs">বিস্তারিত দেখুন →</span>
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }}>
          <button onClick={(e) => { e.stopPropagation(); setSelectedMedia(null); }} className="absolute top-6 right-6 text-white hover:scale-110 transition-transform z-10"><X size={32} /></button>
          <div className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {getYoutubeId(selectedMedia) ? (
              <iframe className="w-full aspect-video rounded-xl" src={`https://www.youtube.com/embed/${getYoutubeId(selectedMedia)}?autoplay=1`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : selectedMedia.match(/\.(mp4|webm|ogg)$/) ? (
              <video controls autoPlay className="max-w-full max-h-full rounded-xl"><source src={selectedMedia} /></video>
            ) : (
              <img src={selectedMedia} alt="Evidence" className="max-w-full max-h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
