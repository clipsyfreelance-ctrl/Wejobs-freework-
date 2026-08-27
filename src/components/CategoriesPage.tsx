import React from 'react';
import { Edit3, Feather, FileCheck, BookOpen, ChevronRight, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

interface CategoriesPageProps {
  onNavigate: (route: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const disciplines = [
    {
      title: 'Writing',
      icon: <Edit3 className="w-8 h-8 text-orange-500" />,
      tagline: 'Direct copy, informative articles, press releases, and structured blog posts.',
      paymentRange: '$5.00 – $45.00 USD',
      wordCounts: '500 – 2,500 Words',
      subtypes: [
        { name: 'Articles & Insights', desc: 'Industry-specific editorial features and long-form analysis.' },
        { name: 'Blog Posts & Listicles', desc: 'Engaging, SEO-optimized web content for digital publications.' },
        { name: 'Copywriting & Landing Copy', desc: 'High-conversion headline and promotional ad copy.' },
        { name: 'Product Descriptions', desc: 'E-commerce product highlights and feature breakdowns.' },
        { name: 'Press Releases', desc: 'Formal media announcements and corporate statements.' },
        { name: 'Business Proposals', desc: 'Structured service pitches and executive project summaries.' },
      ],
    },
    {
      title: 'Creative Writing',
      icon: <Feather className="w-8 h-8 text-amber-500" />,
      tagline: 'Engaging narrative prose, character sketches, poetry, and storytelling commissions.',
      paymentRange: '$8.00 – $65.00 USD',
      wordCounts: '800 – 4,000 Words',
      subtypes: [
        { name: 'Fiction Short Stories', desc: 'Original narrative worldbuilding with compelling arcs.' },
        { name: 'Drama & Video Scripts', desc: 'Dialogue scripts and scene breakdowns for multimedia.' },
        { name: 'Poetry & Lyric Prose', desc: 'Rhythmic, thematic verse for creative publications.' },
        { name: 'Character Backgrounds', desc: 'Comprehensive backstory dossiers for lore and gaming.' },
      ],
    },
    {
      title: 'Editing',
      icon: <FileCheck className="w-8 h-8 text-emerald-500" />,
      tagline: 'Meticulous proofreading, grammar corrections, tone alignment, and structural refining.',
      paymentRange: '$4.00 – $35.00 USD',
      wordCounts: '500 – 5,000 Words',
      subtypes: [
        { name: 'Proofreading & Typo Fixes', desc: 'Fast-paced grammar, spelling, and punctuation checks.' },
        { name: 'Line & Stylistic Editing', desc: 'Enhancing prose flow, vocabulary choice, and cadence.' },
        { name: 'Structural & Developmental Editing', desc: 'Reorganizing chapter outlines and logical progression.' },
        { name: 'Simplification & Plain Language', desc: 'Translating dense technical copy into accessible prose.' },
      ],
    },
    {
      title: 'Research & Writing',
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      tagline: 'In-depth literature summaries, market research digests, and cited academic briefings.',
      paymentRange: '$12.00 – $85.00 USD',
      wordCounts: '1,200 – 6,000 Words',
      subtypes: [
        { name: 'Literature Reviews', desc: 'Synthesizing academic sources and peer-reviewed studies.' },
        { name: 'Research Digests', desc: 'Condensing technical papers into actionable executive briefs.' },
        { name: 'Market & Industry Briefs', desc: 'Evaluating market dynamics, competitors, and trends.' },
        { name: 'Fact-Checking & Source Audits', desc: 'Cross-verifying statistical claims with primary citations.' },
      ],
    },
  ];

  return (
    <div id="categories-page" className="py-12 sm:py-16 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Writing Disciplines & Micro-Job Specializations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Browse our 4 core editorial branches. Every category is pre-funded in escrow and features
            clear word counts, verified client briefs, and fixed USD settlement rates.
          </p>
        </div>

        <div className="space-y-8">
          {disciplines.map((d) => (
            <div
              key={d.title}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
                    {d.icon}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                      {d.title}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">{d.tagline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                    {d.paymentRange}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                    {d.wordCounts}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {d.subtypes.map((st) => (
                  <div
                    key={st.name}
                    onClick={() => onNavigate(`/tasks?cat=${encodeURIComponent(d.title)}`)}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-750 hover:border-orange-500 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-neutral-900 dark:text-white text-xs group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        {st.name}
                      </h4>
                      <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onNavigate(`/tasks?cat=${encodeURIComponent(d.title)}`)}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Explore All {d.title} Tasks
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
