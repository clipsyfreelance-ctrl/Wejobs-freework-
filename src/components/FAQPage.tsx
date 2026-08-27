import React, { useState, useMemo } from 'react';
import { FAQItem } from '../types';
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, DollarSign, ShieldCheck, FileCheck } from 'lucide-react';

interface FAQPageProps {
  faqs?: FAQItem[];
  onNavigate: (route: string) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ faqs = [], onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ 'faq-1': true, 'faq-2': true });

  const categories = [
    { key: 'all', label: 'All Questions' },
    { key: 'General & Platform', label: 'General & Platform' },
    { key: 'Tasks & Submission', label: 'Tasks & Submission' },
    { key: 'Earnings & Withdrawals', label: 'Earnings & Withdrawals' },
    { key: 'Security & Integrity', label: 'Security & Integrity' },
    { key: 'Editorial Reviews', label: 'Editorial Reviews' },
  ];

  const filteredFaqs = useMemo(() => {
    let list = [...(faqs || [])];
    if (activeCategory !== 'all') {
      list = list.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    }
    return list;
  }, [faqs, activeCategory, searchQuery]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div id="faq-page" className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 mb-1">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Find immediate answers on task reservation, deliverable standards, USD balance settlement,
            and the $100.00 withdrawal threshold.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQ keywords (e.g. withdrawal, word count, revision, escrow)..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 text-xs">
              No FAQ matching "{searchQuery}".
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-800/60 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Need More Assistance Banner */}
        <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-md text-center space-y-3">
          <h3 className="text-base font-bold">Have a question not covered in our knowledge base?</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Our editorial and support team reviews inquiries 24/7 to maintain high quality standards.
          </p>
          <button
            onClick={() => onNavigate('/tasks')}
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Explore Open Writing Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
