import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Booking, WalletLedger } from '../types';
import { useLanguage } from '../i18n';
import { useCurrency } from '../contexts/CurrencyContext';

interface PartnerChartsProps {
    bookings: Booking[];
    ledger: WalletLedger[];
}

const PartnerCharts: React.FC<PartnerChartsProps> = ({ bookings, ledger }) => {
    const { t } = useLanguage();
    const { formatCurrency } = useCurrency();

    // Process data for Revenue Chart
    const revenueData = ledger
        .filter(entry => entry.entry_type === 'credit')
        .reduce((acc, entry) => {
            const date = new Date(entry.created_at).toISOString().split('T')[0];
            const amount = entry.amount_minor / 100;
            acc[date] = (acc[date] || 0) + amount;
            return acc;
        }, {} as Record<string, number>);

    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const chartData = last30Days.map(date => ({
        date,
        revenue: revenueData[date] || 0,
    }));

    // Process data for Bookings by Room Type Chart
    const roomTypeData = bookings
        .reduce((acc, booking) => {
            const roomName = booking.room_types?.name || 'Unknown Room';
            acc[roomName] = (acc[roomName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

    const pieData = Object.entries(roomTypeData).map(([name, value]) => ({ name, value }));
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4">{t('partner.charts.revenue')}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="date" fontSize={12} tick={{ fill: 'currentColor' }} />
                        <YAxis tickFormatter={(value) => formatCurrency(Number(value) * 100)} fontSize={12} tick={{ fill: 'currentColor' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#fff' }}
                            formatter={(value) => [formatCurrency(Number(value) * 100), "Revenue"]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border dark:border-slate-700">
                <h3 className="text-lg font-bold mb-4">{t('partner.charts.roomTypes')}</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={(entry) => `${entry.name} (${entry.value})`}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '0.5rem' }}
                            labelStyle={{ color: '#fff' }}
                        />
                         <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PartnerCharts;
