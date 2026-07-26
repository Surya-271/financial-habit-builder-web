import React, { useEffect, useState } from 'react';
import { wealthAPI, habitAPI, savingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  Bell,
  AlertTriangle,
  Flame,
  CheckCircle,
  TrendingDown,
  Info,
  Loader2,
  Calendar,
} from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const generateNotifications = async () => {
    try {
      setLoading(true);
      const list = [];

      // 1. Fetch data sets
      const dashRes = await wealthAPI.getDashboard();
      const habitsRes = await habitAPI.getAll();
      const savingsRes = await savingsAPI.getAll();

      if (dashRes.data.success && habitsRes.data.success && savingsRes.data.success) {
        const { summary } = dashRes.data;
        const habits = habitsRes.data.data;
        const goals = savingsRes.data.data;

        // 2. Budget check
        const budget = user?.profile?.monthlyBudget || 0;
        if (budget > 0 && summary.totalExpense > budget) {
          list.push({
            id: 'budget_exceeded',
            type: 'warning',
            icon: AlertTriangle,
            title: 'Budget Alert',
            message: `You have spent ${currencySymbol}${summary.totalExpense.toLocaleString()} this month, exceeding your monthly limit of ${currencySymbol}${budget.toLocaleString()}.`,
            date: new Date(),
          });
        }

        // 3. Goal deadlines
        goals.forEach(goal => {
          const isOverdue = new Date(goal.deadline) < new Date() && goal.status !== 'completed';
          if (isOverdue) {
            list.push({
              id: `goal_overdue_${goal._id}`,
              type: 'danger',
              icon: Calendar,
              title: `Savings Goal Overdue: ${goal.name}`,
              message: `The target deadline of ${new Date(goal.deadline).toLocaleDateString()} has passed. Balance stands at ${goal.progressPercent}% of target.`,
              date: new Date(goal.deadline),
            });
          } else if (goal.status === 'completed') {
            list.push({
              id: `goal_comp_${goal._id}`,
              type: 'success',
              icon: CheckCircle,
              title: 'Goal Achieved!',
              message: `Congratulations! You successfully reached your target for "${goal.name}".`,
              date: new Date(goal.updatedAt),
            });
          }
        });

        // 4. Habits streak check
        habits.forEach(habit => {
          if (habit.currentStreak > 3) {
            list.push({
              id: `habit_streak_${habit._id}`,
              type: 'success',
              icon: Flame,
              title: `Outstanding Streak: ${habit.name}!`,
              message: `You have checked in for ${habit.currentStreak} consecutive days. Keep the fire burning!`,
              date: new Date(),
            });
          }
        });

        // 5. Default welcoming info
        list.push({
          id: 'welcome_notification',
          type: 'info',
          icon: Info,
          title: 'Welcome to FinanceHabit',
          message: 'Begin tracking your income, expenses, and habits to build strong compound wealth patterns.',
          date: new Date(user?.createdAt || Date.now()),
        });
      }

      setNotifications(list.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error('Failed to generate notifications', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateNotifications();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Bell className="text-brand-500" />
          Alerts & Notifications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Automated warnings, congratulatory streak milestones, and financial checklists.
        </p>
      </div>

      {/* Notifications list */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={36} className="animate-spin text-brand-500" />
        </div>
      ) : (
        <GlassCard className="p-6 divide-y divide-slate-100 dark:divide-slate-800/60" hover={false}>
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const IconComp = notif.icon;

              const styleMap = {
                success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border-emerald-500/20',
                warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-450 border-amber-500/20',
                danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20',
                info: 'bg-blue-500/10 text-blue-600 dark:text-blue-450 border-blue-500/20',
              };

              return (
                <div key={notif.id} className="py-5 first:pt-0 last:pb-0 flex items-start gap-4">
                  <div className={`p-3 rounded-2xl border ${styleMap[notif.type]}`}>
                    <IconComp size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(notif.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-slate-450 text-sm">
              Your inbox is clear. No active alerts at this time.
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};

export default Notifications;
