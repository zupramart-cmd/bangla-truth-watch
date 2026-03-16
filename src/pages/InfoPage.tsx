import React from 'react';
import { Shield, Lock, AlertTriangle, Eye, Heart, Users, Scale, Globe, Facebook } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function InfoPage() {
  const sections = [
    {
      title: 'Chor Koi কী?',
      icon: Shield,
      content: `"চোর কই" একটি জনগণের ক্ষমতায়নের প্ল্যাটফর্ম যা দুর্নীতি উদ্ঘাটন এবং জনসাধারণের জবাবদিহিতা নিশ্চিত করতে তৈরি করা হয়েছে।\n\nআমরা বিশ্বাস করি যে স্বচ্ছতাই দুর্নীতিমুক্ত সমাজের প্রথম পদক্ষেপ। নাগরিকদের রিপোর্ট এবং যাচাই করার ক্ষমতা দিয়ে আমরা এমন একটি সম্মিলিত কণ্ঠ তৈরি করি যা উপেক্ষা করা যায় না।`,
      color: 'text-red-600 bg-red-50'
    },
    {
      title: 'কিভাবে কাজ করে?',
      icon: Eye,
      content: `ধাপ ১: দুর্নীতি দেখলে রিপোর্ট করুন — ধরন, বিবরণ, অবস্থান ও প্রমাণসহ\nধাপ ২: ম্যাপে সকল রিপোর্ট পিন আকারে দেখা যায়\nধাপ ৩: জনগণ ভোটের মাধ্যমে সত্যতা যাচাই করে\nধাপ ৪: ভোটের ভিত্তিতে রিপোর্টের বিশ্বাসযোগ্যতা নির্ধারণ হয়\n\nসবকিছু সম্পূর্ণ বেনামে — আপনার পরিচয় কখনো প্রকাশ হবে না!`,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'কেন রিপোর্ট করবেন?',
      icon: Heart,
      content: `• দুর্নীতির বিরুদ্ধে আওয়াজ তুলুন\n• আপনার এলাকায় দুর্নীতির তথ্য সবাইকে জানান\n• প্রমাণসহ রিপোর্ট দায়িত্বশীল প্রশাসনে চাপ সৃষ্টি করে\n• জনগণের সম্মিলিত ভোট সত্যতা প্রমাণ করে\n• ম্যাপে চিহ্নিত হলে সংশ্লিষ্ট কর্তৃপক্ষ সচেতন হয়\n\nএকজনের সাহসী পদক্ষেপ হাজারো মানুষকে অনুপ্রাণিত করে!`,
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'ভোটিং সিস্টেম',
      icon: Users,
      content: `প্রতিটি রিপোর্টে তিন ধরনের ভোট দেওয়া যায়:\n\n"সত্য" — আপনি বিশ্বাস করেন রিপোর্টটি সঠিক\n"মিথ্যা" — আপনি মনে করেন রিপোর্টটি ভুল বা মিথ্যা\n"প্রমাণ চাই" — আরো প্রমাণ বা তথ্য প্রয়োজন\n\nলাল পিন = সংখ্যাগরিষ্ঠ "সত্য" ভোট\nহলুদ পিন = "প্রমাণ চাই" সর্বোচ্চ\nসবুজ পিন = সংখ্যাগরিষ্ঠ "মিথ্যা" ভোট\n\nপ্রতিটি রিপোর্টে একবারই ভোট দেওয়া যায়।`,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'গোপনীয়তা নীতি',
      icon: Lock,
      content: `আপনার গোপনীয়তা আমাদের সর্বোচ্চ অগ্রাধিকার।\n\n• রিপোর্ট সম্পূর্ণ বেনামে জমা হয়\n• আপনার ব্যক্তিগত পরিচয় ট্র্যাক করা হয় না\n• লোকেশন ডেটা শুধুমাত্র ম্যাপে রিপোর্ট দেখানোর জন্য ব্যবহৃত হয়\n• কোনো লগইন বা রেজিস্ট্রেশনের প্রয়োজন নেই\n• প্রতিটি রিপোর্টকারীকে একটি স্বয়ংক্রিয় ছদ্মনাম দেওয়া হয়\n• আইপি অ্যাড্রেস সংরক্ষণ করা হয় না`,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'ব্যবহারের শর্তাবলী',
      icon: Scale,
      content: `এই অ্যাপ ব্যবহার করে আপনি সম্মত হচ্ছেন:\n\n• সত্য ও নির্ভুল তথ্য প্রদান করবেন\n• মিথ্যা রিপোর্ট বা দূষিত ব্যবহার করবেন না\n• প্রমাণসহ দায়িত্বশীল রিপোর্ট করবেন\n• অন্যের ব্যক্তিগত তথ্য অনুমতি ছাড়া প্রকাশ করবেন না\n• ভোটিং সিস্টেমের অপব্যবহার করবেন না\n\nমিথ্যা রিপোর্ট বা দূষিত ব্যবহারে রিপোর্ট সরিয়ে ফেলা হতে পারে।`,
      color: 'text-teal-600 bg-teal-50'
    },
    {
      title: 'দায়মুক্তি ঘোষণা',
      icon: AlertTriangle,
      content: `গুরুত্বপূর্ণ তথ্য:\n\n• এই প্ল্যাটফর্মের রিপোর্টগুলি ব্যবহারকারী-জমাকৃত এবং জনগণের ভোটে যাচাইকৃত\n• "চোর কই" প্রতিটি রিপোর্ট স্বাধীনভাবে যাচাই করে না\n• ব্যবহারকারীদের নিজস্ব বিচারবুদ্ধি প্রয়োগ করা উচিত\n• ব্যবহারকারী-তৈরি বিষয়বস্তুর নির্ভুলতার জন্য আমরা দায়ী নই\n• এটি কোনো আইনি প্রমাণ হিসেবে গণ্য নয়`,
      color: 'text-yellow-600 bg-yellow-50'
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="text-center mb-10 animate-fade-in">
        <img src={logo} alt="Chor Koi" className="w-20 h-20 rounded-3xl mx-auto mb-4 shadow-xl object-cover" />
        <h1 className="text-4xl font-black text-gray-900 mb-2">Chor Koi</h1>
        <p className="text-gray-500 font-medium">জনগণের ক্ষমতায়ন • দুর্নীতির বিরুদ্ধে আওয়াজ</p>
      </div>

      <div className="space-y-5 mb-12">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-fade-in hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${section.color}`}>
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 text-center">ডেভেলপার</p>
        <div className="text-center">
          <h3 className="text-xl font-black text-gray-900 mb-4">Md Ridoan Mahmud Zisan</h3>
          <div className="flex items-center justify-center gap-3">
            <a href="https://ridoan-zisan.netlify.app" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 active:scale-95 transition-all">
              <Globe size={16} /> পোর্টফোলিও
            </a>
            <a href="https://www.facebook.com/ridoan.zisan" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all">
              <Facebook size={16} /> ফেসবুক
            </a>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs">
        &copy; {new Date().getFullYear()} Chor Koi। সর্বস্বত্ব সংরক্ষিত।
      </p>
    </div>
  );
}
