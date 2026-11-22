import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  X,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { isWithinDateRange } from '../../../utils/demoFormatters';
import { useLanguage } from '../../../context/LanguageContext';

export interface DataColumn<T> {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render: (row: T) => React.ReactNode;
}

interface InteractiveDataTableProps<T extends { id: string } & Record<string, any>> {
  title: string;
  rows: T[];
  columns: DataColumn<T>[];
  searchPlaceholder?: string;
  getSearchText: (row: T) => string;
  getDateValue?: (row: T) => string;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  headerAction?: React.ReactNode;
}

export function InteractiveDataTable<T extends { id: string } & Record<string, any>>({
  title,
  rows,
  columns,
  searchPlaceholder,
  getSearchText,
  getDateValue,
  onView,
  onEdit,
  onDelete,
  emptyMessage,
  headerAction,
}: InteractiveDataTableProps<T>) {
  const { pick } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const effectiveSearchPlaceholder = searchPlaceholder || pick('Search records...', 'রেকর্ড অনুসন্ধান করুন...');
  const effectiveEmptyMessage = emptyMessage || pick('No matching sample records found.', 'কোনো মিল থাকা নমুনা রেকর্ড পাওয়া যায়নি।');

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rows.filter((row) => {
      if (q && !getSearchText(row).toLowerCase().includes(q)) return false;
      if (getDateValue && (startDate || endDate)) {
        if (!isWithinDateRange(getDateValue(row), startDate, endDate)) return false;
      }
      return true;
    });
  }, [rows, searchQuery, startDate, endDate, getSearchText, getDateValue]);

  const hasActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="rounded-xl bg-white dark:bg-slate-900 border border-[#D7E2F3] dark:border-slate-800 overflow-hidden">
      {/* Header & Controls */}
      <div className="p-4 border-b border-[#D7E2F3] dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-bold text-[#0B1730] dark:text-white">{title}</h4>
            <p className="text-[11px] text-[#5F6D82] dark:text-slate-400 tabular-nums">
              {pick(
                `Showing ${filteredRows.length} of ${rows.length} sample entries`,
                `মোট ${rows.length}টি নমুনা এন্ট্রির মধ্যে ${filteredRows.length}টি দেখানো হচ্ছে`
              )}
            </p>
          </div>
          {headerAction && <div className="lg:hidden">{headerAction}</div>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#5F6D82] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={effectiveSearchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-xs text-[#0B1730] dark:text-white focus:outline-none focus:border-[#0345A4]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5F6D82] hover:text-[#0B1730] cursor-pointer"
                aria-label={pick('Clear search', 'অনুসন্ধান মুছুন')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Optional Date Range Filter */}
          {getDateValue && (
            <div className="flex items-center gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#5F6D82] shrink-0" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label={pick('Filter start date', 'শুরুর তারিখ ফিল্টার')}
                className="px-2 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[11px] text-[#0B1730] dark:text-white"
              />
              <span className="text-[#5F6D82]">–</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label={pick('Filter end date', 'শেষ তারিখ ফিল্টার')}
                className="px-2 py-1.5 rounded-lg bg-[#F4F8FF] dark:bg-slate-800 border border-[#D7E2F3] dark:border-slate-700 text-[11px] text-[#0B1730] dark:text-white"
              />
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="text-[11px] font-semibold text-[#0345A4] hover:underline cursor-pointer px-1"
                >
                  {pick('Clear', 'মুছুন')}
                </button>
              )}
            </div>
          )}

          {headerAction && <div className="hidden lg:block">{headerAction}</div>}
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F4F8FF] dark:bg-slate-800/70 border-b border-[#D7E2F3] dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-[#5F6D82] dark:text-slate-400">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 text-right">{pick('Actions', 'অ্যাকশন')}</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7E2F3]/70 dark:divide-slate-800">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-10 text-center text-[#5F6D82] dark:text-slate-400"
                >
                  {effectiveEmptyMessage}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => {
                const isConfirming = confirmDeleteId === row.id;
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-[#F4F8FF]/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={`${row.id}-${col.key}`}
                        className={`px-4 py-3 text-[#0B1730] dark:text-slate-200 ${
                          col.align === 'right'
                            ? 'text-right font-mono tabular-nums'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        {isConfirming && onDelete ? (
                          <div className="inline-flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg px-2 py-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-300">
                              {pick('Delete?', 'মুছবেন?')}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                onDelete(row.id);
                                setConfirmDeleteId(null);
                              }}
                              className="p-1 rounded bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
                              title={pick('Confirm delete', 'মুছে ফেলা নিশ্চিত করুন')}
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1 rounded bg-white dark:bg-slate-800 text-[#5F6D82] hover:text-[#0B1730] cursor-pointer border border-[#D7E2F3] dark:border-slate-700"
                              title={pick('Cancel delete', 'বাতিল করুন')}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1">
                            {onView && (
                              <button
                                type="button"
                                onClick={() => onView(row)}
                                className="p-1.5 rounded-lg text-[#5F6D82] hover:text-[#0345A4] hover:bg-[#F4F8FF] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={pick('View details', 'বিস্তারিত দেখুন')}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onEdit && (
                              <button
                                type="button"
                                onClick={() => onEdit(row)}
                                className="p-1.5 rounded-lg text-[#5F6D82] hover:text-[#0345A4] hover:bg-[#F4F8FF] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={pick('Edit record', 'রেকর্ড সম্পাদনা করুন')}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(row.id)}
                                className="p-1.5 rounded-lg text-[#5F6D82] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title={pick('Delete record', 'রেকর্ড মুছুন')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
