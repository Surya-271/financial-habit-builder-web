import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  FileBarChart,
  ShieldCheck,
  Loader2,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  FileSpreadsheet,
  Printer,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import ChartJS modules
import { Doughnut, Bar } from 'react-chartjs-2';

const AdminReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getDashboard();
      if (res.data.success) {
        setData(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const downloadCSV = (filename, csvContent) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFormattedDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleExportUsersCSV = async () => {
    try {
      setExporting(true);
      const res = await adminAPI.getUsers();
      if (res.data.success) {
        const users = res.data.data;
        let csv = 'Name,Email,Status,Joined Date\n';
        users.forEach((u) => {
          const name = `"${(u.name || '').replace(/"/g, '""')}"`;
          const email = `"${(u.email || '').replace(/"/g, '""')}"`;
          const status = `"${u.status || 'active'}"`;
          const joined = `"${new Date(u.createdAt).toLocaleDateString()}"`;
          csv += `${name},${email},${status},${joined}\n`;
        });

        const filename = `users_report_${getFormattedDate()}.csv`;
        downloadCSV(filename, csv);
        toast.success(`Exported ${users.length} users to ${filename}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to export users CSV.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportReportsCSV = () => {
    if (!data) return;
    try {
      let csv = 'Metric,Value\n';
      csv += `"Total Users",${data.totalUsers || 0}\n`;
      csv += `"Active Users",${data.activeUsers || 0}\n`;
      csv += `"Suspended Users",${data.suspendedUsers || 0}\n`;
      csv += `"Cumulative Incomes (INR)",${data.totalSystemIncome || 0}\n`;
      csv += `"Cumulative Expenses (INR)",${data.totalSystemExpense || 0}\n`;
      csv += `"Cumulative Investments (INR)",${data.totalSystemInvestments || 0}\n`;
      csv += `"Total Savings Goals",${data.totalSavingsGoals || 0}\n`;
      csv += `"Active Savings Goals",${data.activeSavingsGoals || 0}\n`;
      csv += `"Completed Savings Goals",${data.completedSavingsGoals || 0}\n`;
      csv += `"Target Savings Amount (INR)",${data.totalTargetAmount || 0}\n`;
      csv += `"Total Saved Amount (INR)",${data.totalSavedAmount || 0}\n`;
      csv += `"Total Habits Tracked",${data.totalHabits || 0}\n`;
      csv += `"Habit Check-ins Completed",${data.completedHabits || 0}\n`;
      csv += `"Overall Habit Completion Rate",${data.overallHabitCompletionPercentage || 0}%\n`;
      csv += `"Total User Feedbacks",${data.totalFeedback || 0}\n`;

      const filename = `system_report_${getFormattedDate()}.csv`;
      downloadCSV(filename, csv);
      toast.success(`Exported platform metrics to ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to export reports CSV.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-950/20 text-red-650 rounded-2xl text-center">
        {error || 'Error compiling system reports.'}
      </div>
    );
  }

  // Visual: System User status split (active vs suspended)
  const statusData = {
    labels: ['Active Accounts', 'Suspended Accounts'],
    datasets: [
      {
        data: [data.activeUsers, data.suspendedUsers],
        backgroundColor: ['#10b981', '#f43f5e'],
        borderWidth: 1,
      },
    ],
  };

  // Visual: Collective System Reserves (Deposited Inflows vs Portfolio Value)
  const capitalData = {
    labels: ['Cumulative Inflows', 'Cumulative Outflows', 'Collective Investments'],
    datasets: [
      {
        label: 'Cumulative Capital Distribution (INR)',
        data: [data.totalSystemIncome, data.totalSystemExpense, data.totalSystemInvestments],
        backgroundColor: ['rgba(16, 185, 129, 0.65)', 'rgba(244, 63, 94, 0.65)', 'rgba(99, 102, 241, 0.65)'],
        borderColor: ['#10b981', '#f43f5e', '#6366f1'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8 animate-fade-in print:p-0">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <FileBarChart className="text-purple-600" />
            Platform Reports & Exports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Review platform aggregates, financial metrics, and export data reports.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportUsersCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm text-xs transition disabled:opacity-50"
          >
            <FileSpreadsheet size={16} />
            Export Users CSV
          </button>

          <button
            onClick={handleExportReportsCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-sm text-xs transition disabled:opacity-50"
          >
            <FileSpreadsheet size={16} />
            Export Reports CSV
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl shadow-sm text-xs transition"
          >
            <Printer size={16} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Overview Aggregates (printable) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
        <GlassCard className="p-6 flex flex-col min-h-[385px]">
          <h3 className="text-lg font-bold mb-4 text-slate-850 dark:text-white flex items-center gap-2">
            <PieIcon size={18} className="text-purple-600" />
            Registered Accounts Split
          </h3>
          <div className="h-[260px] w-full relative flex items-center justify-center">
            {data.totalUsers > 0 ? (
              <Doughnut
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            ) : (
              <p className="text-sm text-slate-400">No registered users in the database.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col min-h-[385px]">
          <h3 className="text-lg font-bold mb-4 text-slate-850 dark:text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-600" />
            System Capital Valuations
          </h3>
          <div className="h-[260px] w-full relative">
            <Bar
              data={capitalData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </GlassCard>
      </div>

      {/* Aggregate Balance Sheets */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-bold mb-6 text-slate-850 dark:text-white">Collective Database Telemetry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              User Statistics
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-500">Total User Footprint</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{data.totalUsers} users</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Active / Allowed Users</span>
              <span className="font-semibold text-emerald-600">{data.activeUsers} accounts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Suspended Users</span>
              <span className="font-semibold text-rose-600">{data.suspendedUsers} accounts</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              System Capital Aggregates
            </h4>
            <div className="flex justify-between">
              <span className="text-slate-500">Collective Earnings (Incomes)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹{(data.totalSystemIncome || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Collective Expenditures</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹{(data.totalSystemExpense || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Collective Investments Value</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                ₹{(data.totalSystemInvestments || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminReports;
