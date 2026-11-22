import React from 'react';
import { TrainingCourse } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { localizeCourse } from '../../data/localizedData';
import {
  FileSpreadsheet,
  BookOpen,
  Receipt,
  Layers,
  Laptop,
  Award,
  BarChart3,
  Clock,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface CourseCardProps {
  course: TrainingCourse;
  onSelect: (course: TrainingCourse) => void;
  onEnrollNow: (course: TrainingCourse) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileSpreadsheet,
  BookOpen,
  Receipt,
  Layers,
  Laptop,
  Award,
  BarChart3,
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelect,
  onEnrollNow,
}) => {
  const { isBengali, pick } = useLanguage();
  const loc = localizeCourse(course, isBengali);
  const Icon = ICON_MAP[loc.iconName] || BookOpen;

  return (
    <div
      id={`course-card-${loc.id}`}
      className="card-3d bg-white dark:bg-slate-900 rounded-2xl border border-[#D7E2F3] dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-[#0345A4]/70 group"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="p-3 rounded-xl bg-[#F4F8FF] dark:bg-slate-800 text-[#0345A4] dark:text-sky-400 border border-[#D7E2F3] dark:border-slate-700 group-hover:bg-[#0345A4] group-hover:text-white transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1 text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5F6D82] dark:text-slate-400">
              {loc.categoryLabel}
            </span>
            <span className="text-[11px] font-bold text-[#0345A4] dark:text-sky-400">
              {loc.level}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-[#0B1730] dark:text-white group-hover:text-[#0345A4] dark:group-hover:text-sky-400 transition-colors leading-snug">
            {loc.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#5F6D82] dark:text-slate-400 mt-2 leading-relaxed line-clamp-3">
            {loc.shortDesc}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[#5F6D82] dark:text-slate-400 py-2 border-y border-[#D7E2F3]/70 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#0345A4] dark:text-sky-400" />
            <span>{loc.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0A63D8] dark:text-sky-400" />
            <span>{loc.sessions}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {loc.toolsCovered.slice(0, 3).map((tool, i) => (
            <span
              key={i}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F4F8FF] dark:bg-slate-800 text-[#0B1730] dark:text-slate-300 border border-[#D7E2F3]/80 dark:border-slate-700"
            >
              {tool}
            </span>
          ))}
        </div>

        {/* Verified Fee Box */}
        <div className="p-3.5 rounded-xl bg-[#F4F8FF] dark:bg-slate-800/70 border border-[#D7E2F3] dark:border-slate-700 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#5F6D82] block tracking-wider">
              {pick('Course Fee', 'কোর্স ফি')}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#0B1730] dark:text-white tabular-nums">
              {loc.feeDisplay}
            </span>
          </div>
          {loc.certificateProvided && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0345A4] dark:text-sky-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pick('Certificate', 'সার্টিফিকেট')}</span>
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-[#D7E2F3]/70 dark:border-slate-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect(course)}
          className="text-xs font-bold text-[#0345A4] dark:text-sky-400 hover:text-[#02377F] inline-flex items-center gap-1 cursor-pointer py-1.5"
        >
          <span>{pick('Syllabus', 'সিলেবাস দেখুন')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          type="button"
          onClick={() => onEnrollNow(course)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0345A4] hover:bg-[#02377F] text-white transition-all cursor-pointer"
        >
          {pick('Inquire / Enroll', 'ভর্তি / তথ্য জানুন')}
        </button>
      </div>
    </div>
  );
};

