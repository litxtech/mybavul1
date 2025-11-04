import React, { useState } from 'react';

const AvailabilityCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set(['2024-07-15', '2024-07-16'])); // Example blocked dates

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const toggleDateBlock = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setBlockedDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateStr)) {
                newSet.delete(dateStr);
            } else {
                newSet.add(dateStr);
            }
            return newSet;
        });
    };

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border-r border-b dark:border-slate-700"></div>);
    }
    for (let day = 1; day <= numDays; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isBlocked = blockedDates.has(dateStr);
        calendarDays.push(
            <div
                key={day}
                onClick={() => toggleDateBlock(day)}
                className={`p-2 border-r border-b dark:border-slate-700 cursor-pointer transition-colors ${isBlocked ? 'bg-red-200 dark:bg-red-800/50 hover:bg-red-300' : 'hover:bg-blue-50 dark:hover:bg-slate-700'}`}
            >
                <div className={`font-semibold ${isBlocked ? 'text-red-800 dark:text-red-200' : ''}`}>{day}</div>
                <div className="text-xs mt-1">
                    {isBlocked ? 'Blocked' : 'Available'}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
            <div className="flex justify-between items-center mb-4">
                <button onClick={handlePrevMonth} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md">&larr;</button>
                <h3 className="text-lg font-semibold">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={handleNextMonth} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md">&rarr;</button>
            </div>
            <div className="grid grid-cols-7 border-t border-l dark:border-slate-700">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center font-bold text-sm border-r border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">{day}</div>
                ))}
                {calendarDays}
            </div>
            <p className="text-xs text-slate-500 mt-4">Click on a date to block or unblock it for new bookings. This is a demonstration and does not save data yet.</p>
        </div>
    );
};

export default AvailabilityCalendar;
