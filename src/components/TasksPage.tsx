import React, { useState, useMemo } from 'react';
import { Task, MainCategory, User } from '../types';
import { TaskDetailPage } from './TaskDetailPage';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Clock,
  DollarSign,
  Star,
  Users,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowUpDown,
  BookOpen,
  Feather,
  Edit3,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

interface TasksPageProps {
  tasks?: Task[];
  stats?: {
    totalTasks: number;
    fullTasks: number;
    availableTasks: number;
  };
  user: User | null;
  selectedCategory?: string;
  onClaimTask: (taskId: string) => Promise<boolean>;
  onOpenLogin: () => void;
  onRefreshTasks?: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks = [],
  stats = { totalTasks: 0, fullTasks: 0, availableTasks: 0 },
  user,
  selectedCategory = 'all',
  onClaimTask,
  onOpenLogin,
  onRefreshTasks,
}) => {
  const safeTasks = tasks || [];
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory);
  const [activeSubtype, setActiveSubtype] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'full'>('available');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [minPayment, setMinPayment] = useState<number>(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 24;

  const categories: { label: string; value: string; count: number }[] = [
    { label: 'All Disciplines', value: 'all', count: stats?.totalTasks ?? safeTasks.length },
    { label: 'Writing', value: 'Writing', count: safeTasks.filter((t) => t.category === 'Writing').length },
    { label: 'Creative Writing', value: 'Creative Writing', count: safeTasks.filter((t) => t.category === 'Creative Writing').length },
    { label: 'Editing', value: 'Editing', count: safeTasks.filter((t) => t.category === 'Editing').length },
    { label: 'Research & Writing', value: 'Research & Writing', count: safeTasks.filter((t) => t.category === 'Research & Writing').length },
    { label: 'Translation', value: 'Translation', count: safeTasks.filter((t) => t.category === 'Translation').length },
    { label: 'Transcription', value: 'Transcription', count: safeTasks.filter((t) => t.category === 'Transcription').length },
    { label: 'Data Annotation', value: 'Data Annotation', count: safeTasks.filter((t) => t.category === 'Data Annotation').length },
  ];

  const subtypes = useMemo(() => {
    if (activeCategory === 'all') return [];
    const set = new Set<string>();
    safeTasks.forEach((t) => {
      if (t.category === activeCategory) {
        set.add(t.subtype);
      }
    });
    return Array.from(set);
  }, [safeTasks, activeCategory]);

  const filteredTasks = useMemo(() => {
    let result = [...safeTasks];

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Subtype filter
    if (activeSubtype !== 'all') {
      result = result.filter((t) => t.subtype.toLowerCase() === activeSubtype.toLowerCase());
    }

    // Status filter
    if (statusFilter === 'available') {
      result = result.filter((t) => t.remainingSlots > 0 && t.status === 'available');
    } else if (statusFilter === 'full') {
      result = result.filter((t) => t.remainingSlots <= 0 || t.status === 'full');
    }

    // Min payment
    if (minPayment > 0) {
      result = result.filter((t) => t.payment >= minPayment);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.subtype.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'highest_payment') {
      result.sort((a, b) => b.payment - a.payment);
    } else if (sortBy === 'lowest_payment') {
      result.sort((a, b) => a.payment - b.payment);
    } else if (sortBy === 'most_slots') {
      result.sort((a, b) => b.remainingSlots - a.remainingSlots);
    } else if (sortBy === 'almost_full') {
      result.sort((a, b) => {
        if (a.remainingSlots === 0) return 1;
        if (b.remainingSlots === 0) return -1;
        return a.remainingSlots - b.remainingSlots;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.clientRating - a.clientRating);
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [safeTasks, activeCategory, activeSubtype, statusFilter, minPayment, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentPageClamped = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPageClamped - 1) * pageSize;
    return filteredTasks.slice(startIndex, startIndex + pageSize);
  }, [filteredTasks, currentPageClamped, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="tasks-explorer" className="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title with Dynamic Live Database Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              Explore Writing Jobs & Micro-Tasks
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Showing <span className="font-bold text-neutral-800 dark:text-neutral-200">{filteredTasks.length}</span> of{' '}
              <span className="font-bold text-neutral-800 dark:text-neutral-200">{stats.totalTasks}</span> total tasks in catalog
              ({stats.availableTasks} available • {stats.fullTasks} at full capacity).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onRefreshTasks && (
              <button
                onClick={onRefreshTasks}
                className="p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:text-orange-500 transition-colors"
                title="Refresh Task Database"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Quick Status Segmented Switch */}
            <div className="inline-flex p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'available'
                    ? 'bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Available ({stats.availableTasks})
              </button>
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                All ({stats.totalTasks})
              </button>
              <button
                onClick={() => setStatusFilter('full')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'full'
                    ? 'bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Full ({stats.fullTasks})
              </button>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords, writing style, client name, or deliverable..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="highest_payment">Sort: Highest Payment ($)</option>
                  <option value="lowest_payment">Sort: Lowest Payment ($)</option>
                  <option value="most_slots">Sort: Most Available Slots</option>
                  <option value="almost_full">Sort: Almost Full</option>
                  <option value="rating">Sort: Client Rating</option>
                </select>
              </div>

              {/* Min Payment Filter */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Min $:</span>
                <select
                  value={minPayment}
                  onChange={(e) => setMinPayment(Number(e.target.value))}
                  className="px-2.5 py-2.5 text-xs font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="0">All</option>
                  <option value="5">$5.00+</option>
                  <option value="15">$15.00+</option>
                  <option value="30">$30.00+</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setActiveSubtype('all');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeCategory === cat.value
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeCategory === cat.value
                      ? 'bg-orange-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Subtypes Pills (if specific category selected) */}
          {subtypes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-neutral-100 dark:border-neutral-800 text-[11px]">
              <span className="font-semibold text-neutral-400 mr-1">Subtypes:</span>
              <button
                onClick={() => setActiveSubtype('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeSubtype === 'all'
                    ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                }`}
              >
                All {activeCategory}
              </button>
              {subtypes.map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveSubtype(st)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeSubtype === st
                      ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900 font-bold'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Task Cards Grid */}
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <BookOpen className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No Writing Tasks Match Your Current Filters
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
              Try adjusting your category, status, or search query to browse other open opportunities.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveSubtype('all');
                setStatusFilter('available');
                setSearchQuery('');
                setMinPayment(0);
                setCurrentPage(1);
              }}
              className="mt-2 px-4 py-2 text-xs font-bold rounded-xl bg-orange-500 text-white cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400 px-1">
              <div>
                Menampilkan{' '}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {(currentPageClamped - 1) * pageSize + 1}
                </span>{' '}
                -{' '}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {Math.min(currentPageClamped * pageSize, filteredTasks.length)}
                </span>{' '}
                dari{' '}
                <span className="font-bold text-neutral-900 dark:text-white">
                  {filteredTasks.length.toLocaleString()}
                </span>{' '}
                Total Lowongan Tugas (Halaman {currentPageClamped} dari {totalPages})
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginatedTasks.map((task) => {
                const isFull = task.remainingSlots <= 0 || task.status === 'full';
                return (
                  <div
                    key={task.id}
                    id={`task-card-${task.id}`}
                    onClick={() => setSelectedTask(task)}
                    className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500/60 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      {/* Category & Payment Header */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {task.category}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            {task.subtype}
                          </span>
                        </div>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          ${task.payment.toFixed(2)} USD
                        </span>
                      </div>

                      {/* Task Title */}
                      <h3 className="text-sm font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                        {task.title}
                      </h3>

                      {/* Description preview */}
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    {/* Footer metadata & Action Button */}
                    <div className="mt-4 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" /> {task.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />{' '}
                          {task.clientRating.toFixed(1)}
                        </span>
                        <span
                          className={`font-bold ${
                            isFull
                              ? 'text-rose-600 dark:text-rose-400'
                              : task.remainingSlots <= 5
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {isFull ? 'FULL' : `${task.remainingSlots} slots left`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="w-full py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-orange-500 hover:text-white dark:bg-neutral-800 dark:hover:bg-orange-600 text-neutral-800 dark:text-neutral-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>View Job Brief</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPageClamped === 1}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    « First
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPageClamped - 1)}
                    disabled={currentPageClamped === 1}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    ‹ Prev
                  </button>
                </div>

                {/* Page Numbers */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  {(() => {
                    const pages: (number | string)[] = [];
                    const startPage = Math.max(1, currentPageClamped - 2);
                    const endPage = Math.min(totalPages, currentPageClamped + 2);

                    if (startPage > 1) {
                      pages.push(1);
                      if (startPage > 2) pages.push('...');
                    }

                    for (let p = startPage; p <= endPage; p++) {
                      pages.push(p);
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) pages.push('...');
                      pages.push(totalPages);
                    }

                    return pages.map((p, idx) => {
                      if (p === '...') {
                        return (
                          <span key={`dots-${idx}`} className="px-2 text-neutral-400 text-xs">
                            ...
                          </span>
                        );
                      }
                      const pageNum = p as number;
                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            currentPageClamped === pageNum
                              ? 'bg-orange-500 text-white shadow-xs'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPageClamped + 1)}
                    disabled={currentPageClamped === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Next ›
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPageClamped === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                  >
                    Last »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailPage
          task={selectedTask}
          user={user}
          onClose={() => setSelectedTask(null)}
          onClaimTask={async (id) => {
            const res = await onClaimTask(id);
            if (res) {
              // decrement local state for instant responsiveness
              selectedTask.remainingSlots = Math.max(0, selectedTask.remainingSlots - 1);
              if (selectedTask.remainingSlots === 0) selectedTask.status = 'full';
            }
            return res;
          }}
          onOpenLogin={onOpenLogin}
        />
      )}
    </div>
  );
};
