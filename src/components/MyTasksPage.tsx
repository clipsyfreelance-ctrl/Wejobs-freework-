import React, { useState } from 'react';
import { TaskAssignment, User } from '../types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Send,
  X,
  AlertCircle,
  History,
  Search,
  BookOpen,
} from 'lucide-react';

interface MyTasksPageProps {
  assignments?: TaskAssignment[];
  user: User;
  onSubmitWork: (
    assignmentId: string,
    submission: {
      fileName: string;
      fileSize: number;
      fileDataUrl?: string;
      note: string;
      referenceLink?: string;
    }
  ) => Promise<boolean>;
  onNavigate: (route: string) => void;
}

export const MyTasksPage: React.FC<MyTasksPageProps> = ({
  assignments = [],
  user,
  onSubmitWork,
  onNavigate,
}) => {
  const safeAssignments = assignments || [];
  const [activeTab, setActiveTab] = useState<
    'all' | 'in_progress' | 'under_review' | 'revision_required' | 'completed'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedAssignment, setSelectedAssignment] = useState<TaskAssignment | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileDataUrl, setFileDataUrl] = useState<string | undefined>();
  const [submissionNote, setSubmissionNote] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Word & Character count calculation
  const noteWordCount = submissionNote.trim()
    ? submissionNote.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const noteCharCount = submissionNote.length;

  const filteredAssignments = safeAssignments.filter((a) => {
    // Status tab filter
    if (activeTab === 'in_progress' && !(a.status === 'in_progress' || a.status === 'awaiting_submission')) return false;
    if (activeTab === 'under_review' && a.status !== 'under_review') return false;
    if (activeTab === 'revision_required' && a.status !== 'revision_required') return false;
    if (activeTab === 'completed' && !(a.status === 'completed' || a.status === 'accepted')) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (a.taskTitle || '').toLowerCase().includes(q);
      const matchCategory = (a.category || '').toLowerCase().includes(q);
      const matchSubtype = (a.subtype || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchSubtype) return false;
    }

    return true;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['.docx', '.pdf', '.txt'];
    const nameLower = file.name.toLowerCase();
    const hasAllowedExt = allowed.some((ext) => nameLower.endsWith(ext));

    if (!hasAllowedExt) {
      setSubmitError('Only .DOCX, .PDF, and .TXT files are supported.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setSubmitError('File size must be under 15MB.');
      return;
    }

    setSubmitError(null);
    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!fileName) {
      setSubmitError('Please attach your written deliverable file.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const success = await onSubmitWork(selectedAssignment.id, {
        fileName,
        fileSize,
        fileDataUrl,
        note: submissionNote,
        referenceLink,
      });

      if (success) {
        setSubmitModalOpen(false);
        setFileName('');
        setSubmissionNote('');
        setReferenceLink('');
        setSelectedAssignment(null);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to upload submission.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
      case 'awaiting_submission':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'under_review':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Under Review
          </span>
        );
      case 'revision_required':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Revision Required
          </span>
        );
      case 'completed':
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed & Paid
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div id="my-tasks-page" className="py-8 sm:py-12 bg-neutral-50 dark:bg-neutral-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
              My Tasks & Submissions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Manage claimed writing jobs, upload deliverable files, and view editorial revision
              feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search filter */}
            <div className="relative min-w-[200px] sm:min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search my tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => onNavigate('/tasks')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Open Jobs
            </button>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { key: 'all', label: 'All Assignments', count: safeAssignments.length },
            {
              key: 'in_progress',
              label: 'In Progress',
              count: safeAssignments.filter((a) => a.status === 'in_progress').length,
            },
            {
              key: 'under_review',
              label: 'Under Review',
              count: safeAssignments.filter((a) => a.status === 'under_review').length,
            },
            {
              key: 'revision_required',
              label: 'Revision Required',
              count: safeAssignments.filter((a) => a.status === 'revision_required').length,
            },
            {
              key: 'completed',
              label: 'Completed',
              count: safeAssignments.filter((a) => a.status === 'completed').length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-400 border-t-2 border-orange-500 shadow-xs'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Assignments Table / List */}
        {filteredAssignments.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              No Tasks In This Category
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              You haven't claimed any tasks matching this filter status yet.
            </p>
            <button
              onClick={() => onNavigate('/tasks')}
              className="mt-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-orange-500 text-white"
            >
              Browse Open Writing Tasks
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {assignment.category}
                    </span>
                    <span className="text-xs text-neutral-400 font-medium">
                      {assignment.subtype}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                      ${assignment.payment.toFixed(2)} USD
                    </span>
                    {statusBadge(assignment.status)}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    {assignment.taskTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                    <span>Assigned: {new Date(assignment.assignedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Deadline:{' '}
                      {new Date(assignment.deadlineAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Revision Notice Banner if revision required */}
                {assignment.status === 'revision_required' && assignment.revisionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span>Editorial Revision Feedback:</span>
                    </div>
                    <p className="pl-5 text-neutral-700 dark:text-neutral-300">
                      "{assignment.revisionReason}"
                    </p>
                  </div>
                )}

                {/* Submission Versioning History */}
                {assignment.submissionVersions && assignment.submissionVersions.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                      <History className="w-3.5 h-3.5" /> Version History ({assignment.submissionVersions.length})
                    </span>
                    <div className="space-y-1.5 divide-y divide-neutral-200/40 dark:divide-neutral-700/40 text-xs">
                      {assignment.submissionVersions.map((v) => (
                        <div key={v.versionNumber} className="pt-1.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">
                              v{v.versionNumber}
                            </span>
                            <span className="text-neutral-500">{v.fileName}</span>
                            <span className="text-[10px] text-neutral-400">
                              ({(v.fileSize / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold capitalize text-neutral-600 dark:text-neutral-400">
                            {v.status.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  {['in_progress', 'awaiting_submission', 'revision_required'].includes(
                    assignment.status
                  ) && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setSubmitModalOpen(true);
                      }}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>
                        {assignment.status === 'revision_required'
                          ? `Submit Revision (v${assignment.submissionVersions.length + 1})`
                          : 'Submit Work (v1)'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Upload Modal */}
      {submitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 my-8 text-neutral-900 dark:text-white">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                Submission Delivery • Version {selectedAssignment.submissionVersions.length + 1}
              </span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-1">
                {selectedAssignment.taskTitle}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Upload your completed deliverable document (.DOCX, .PDF, or .TXT).
              </p>
            </div>

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* File Attachment Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Deliverable File (.DOCX, .PDF, .TXT) *
                </label>
                <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-orange-500 bg-neutral-50 dark:bg-neutral-800/40 text-center cursor-pointer relative">
                  <input
                    type="file"
                    accept=".docx,.pdf,.txt"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {fileName ? fileName : 'Click or Drag file to attach'}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    {fileName ? `${(fileSize / 1024).toFixed(1)} KB` : 'Maximum file size: 15MB'}
                  </p>
                </div>
              </div>

              {/* Work Notes / Summary */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Submission Notes / Executive Summary
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {noteWordCount} words • {noteCharCount} chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="Provide any relevant context on word count, tone adjustments, or specific sections..."
                  className="w-full p-3 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Reference Links */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Reference Links / Citations (Optional)
                </label>
                <input
                  type="url"
                  value={referenceLink}
                  onChange={(e) => setReferenceLink(e.target.value)}
                  placeholder="https://docs.google.com/... or source URLs"
                  className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !fileName}
                  className="px-6 py-2 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Uploading...' : 'Send for Editorial Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
