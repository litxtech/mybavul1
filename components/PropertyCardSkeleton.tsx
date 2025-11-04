import React from 'react';

const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
      <div className="md:w-1/3 bg-slate-200 dark:bg-slate-700 h-48 md:h-auto"></div>
      <div className="md:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="w-1/2 space-y-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
          <div className="w-1/4 space-y-2 text-right">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-full ml-auto"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 ml-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSkeleton;
