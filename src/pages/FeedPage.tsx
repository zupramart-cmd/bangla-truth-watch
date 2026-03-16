import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Report } from '../types';
import ReportCard from '../components/ReportCard';
import { DEFAULT_CORRUPTION_TYPES } from '../constants';
import { getCorruptionIcon } from '../lib/corruptionIcons';
import { TrendingUp, Clock, MapPin as MapPinIcon, Search, AlertTriangle, BarChart3, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function FeedPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'trending' | 'near'>('latest');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reports'), (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Report[];
      const approved = reportsData.filter(r => (r as any).status === 'approved');
      approved.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReports(approved);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reports');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortBy]);

  const getFilteredReports = () => {
    let filtered = [...reports];
    if (filterType !== 'all') filtered = filtered.filter(r => r.corruptionType === filterType);
    if (sortBy === 'latest') filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    else if (sortBy === 'trending') filtered.sort((a, b) => (b.votesTrue + b.votesFalse + b.votesNeedEvidence) - (a.votesTrue + a.votesFalse + a.votesNeedEvidence));
    else if (sortBy === 'near' && userLocation) {
      filtered.sort((a, b) => {
        const dA = Math.sqrt(Math.pow(a.latitude - userLocation.lat, 2) + Math.pow(a.longitude - userLocation.lng, 2));
        const dB = Math.sqrt(Math.pow(b.latitude - userLocation.lat, 2) + Math.pow(b.longitude - userLocation.lng, 2));
        return dA - dB;
      });
    }
    return filtered;
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSortBy('near');
      });
    }
  };

  const filteredReports = getFilteredReports();
  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);
  const paginatedReports = filteredReports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const todayReports = reports.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length;
  const selectedType = DEFAULT_CORRUPTION_TYPES.find(t => t.name === filterType);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mx-4 mt-4 mb-4 bg-red-600 rounded-2xl p-5 shadow-lg relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-red-700/50 to-red-500/50" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AlertTriangle size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest">আজকের রিপোর্ট</p>
              <p className="text-4xl font-black text-white leading-none mt-0.5">{todayReports}</p>
            </div>
          </div>
          <div className="h-14 w-px bg-white/30" />
          <div className="flex items-center gap-3">
            <div>
              <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest text-right">মোট রিপোর্ট</p>
              <p className="text-4xl font-black text-white leading-none text-right mt-0.5">{reports.length}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BarChart3 size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[56px] z-30 bg-gray-50 px-4 pt-3 pb-3 space-y-3">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-2">
              {filterType === 'all' ? <AlertTriangle size={16} className="text-red-500" /> : getCorruptionIcon(filterType, 16)}
              <span>{filterType === 'all' ? 'সব ধরন' : filterType}</span>
            </div>
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto animate-scale-in">
              <button onClick={() => { setFilterType('all'); setShowDropdown(false); }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left transition-colors ${filterType === 'all' ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                <AlertTriangle size={16} /> সব ধরন
              </button>
              {DEFAULT_CORRUPTION_TYPES.map(type => (
                <button key={type.id} onClick={() => { setFilterType(type.name); setShowDropdown(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-bold text-left transition-colors ${filterType === type.name ? 'bg-red-50 text-red-600' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {getCorruptionIcon(type.name, 16)} {type.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={() => setSortBy('latest')} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${sortBy === 'latest' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <Clock size={14} /> সাম্প্রতিক
          </button>
          <button onClick={() => setSortBy('trending')} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${sortBy === 'trending' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <TrendingUp size={14} /> ট্রেন্ডিং
          </button>
          <button onClick={handleNearMe} className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${sortBy === 'near' ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
            <MapPinIcon size={14} /> কাছাকাছি
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">লোড হচ্ছে...</p>
        </div>
      ) : paginatedReports.length > 0 ? (
        <>
          <div className="md:px-4 md:grid md:grid-cols-2 md:gap-4">
            {paginatedReports.map((report, i) => (
              <div key={report.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <ReportCard report={report} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-6 px-4">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 disabled:opacity-40 active:scale-95 transition-all">
                পূর্ববর্তী
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) page = i + 1;
                  else if (currentPage <= 3) page = i + 1;
                  else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                  else page = currentPage - 2 + i;
                  return (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all active:scale-95 ${currentPage === page ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
                      {page}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-white border border-gray-200 disabled:opacity-40 active:scale-95 transition-all">
                পরবর্তী
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 mx-4 bg-white rounded-2xl border border-dashed border-gray-300 animate-fade-in">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">কোনো রিপোর্ট পাওয়া যায়নি।</p>
        </div>
      )}
    </div>
  );
}
