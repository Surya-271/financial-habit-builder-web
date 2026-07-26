import React, { useEffect, useState } from 'react';
import { habitAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Flame,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [target, setTarget] = useState('1');

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const res = await habitAPI.getAll();
      if (res.data.success) {
        setHabits(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve habits.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setTarget('1');
    setFrequency('daily');
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingId(habit._id);
    setName(habit.name);
    setTarget(habit.target || '1');
    setFrequency(habit.frequency);
    setDescription(habit.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    const trimmedName = name ? name.trim() : '';
    if (!trimmedName) {
      setError('Habit name cannot be empty or contain only whitespace.');
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 100) {
      setError('Habit name must be between 3 and 100 characters.');
      return;
    }

    const targetVal = Number(target);
    if (isNaN(targetVal) || targetVal <= 0) {
      setError('Target value must be greater than zero.');
      return;
    }

    if (!frequency) {
      setError('Please select a frequency.');
      return;
    }

    const isDuplicate = habits.some(
      h => h._id !== editingId && h.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError('A habit with this name already exists.');
      return;
    }

    const payload = {
      name: trimmedName,
      description,
      frequency,
      target: targetVal,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await habitAPI.update(editingId, payload);
        if (res.data.success) {
          await fetchHabits();
          setModalOpen(false);
        }
      } else {
        const res = await habitAPI.create(payload);
        if (res.data.success) {
          await fetchHabits();
          setModalOpen(false);
          setName('');
          setDescription('');
          setFrequency('daily');
          setTarget('1');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleDate = async (id, dateStr) => {
    if (togglingId) return;
    const todayStr = getLocalDateString();
    if (dateStr !== todayStr) {
      setError('Habits can only be marked as completed for today.');
      return;
    }

    setTogglingId(id);
    try {
      const res = await habitAPI.toggle(id, dateStr);
      if (res.data.success) {
        // Refresh habit data to update streaks and completion logs
        const updatedAPI = await habitAPI.getAll();
        if (updatedAPI.data.success) {
          setHabits(updatedAPI.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Toggle failed.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    if (!window.confirm('Are you sure you want to delete this habit? All streaks and history will be lost.')) return;
    setDeletingId(id);
    try {
      const res = await habitAPI.delete(id);
      if (res.data.success) {
        setHabits(habits.filter(h => h._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to format date as YYYY-MM-DD
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate last 7 days array to draw a check-in calendar grid
  const getPastWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push({
        dateStr: getLocalDateString(d),
        label: d.toLocaleDateString('default', { weekday: 'narrow' }),
        dayNum: d.getDate(),
      });
    }
    return dates;
  };

  const weekTimeline = getPastWeekDates();
  const todayStr = getLocalDateString();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Calendar className="text-brand-500" />
            Financial Habit Builder
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build discipline. Complete targets, track streaks, and develop rich wealth habits.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          Create Habit
        </button>
      </div>

      {/* Main habits view */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={36} className="animate-spin text-brand-500" />
        </div>
      ) : habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {habits.map((habit) => {
            const hasCheckedToday = habit.history?.some(
              (item) => item.date === todayStr && item.completed
            );

            return (
              <GlassCard key={habit._id} className="p-6 flex flex-col justify-between" hover={true}>
                <div>
                  {/* Title & Frequency badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                        {habit.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 capitalize">{habit.frequency} habit • Target: {habit.target || 1}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openEditModal(habit)}
                        disabled={deletingId !== null}
                        className="p-1.5 text-slate-400 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                        title="Edit Habit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(habit._id)}
                        disabled={deletingId !== null}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                        title="Delete Habit"
                      >
                        {deletingId === habit._id ? (
                          <Loader2 size={16} className="animate-spin text-rose-500" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 h-10 overflow-hidden line-clamp-2">
                    {habit.description || 'No description provided.'}
                  </p>

                  {/* Streaks & Progress widgets */}
                  <div className="flex items-center gap-6 mt-6">
                    <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-300 rounded-xl">
                      <Flame size={18} className="fill-amber-500 text-amber-500" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Current</p>
                        <p className="font-extrabold text-sm">{habit.currentStreak} Days</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 rounded-xl">
                      <Sparkles size={18} className="text-indigo-500" />
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Longest</p>
                        <p className="font-extrabold text-sm">{habit.longestStreak} Days</p>
                      </div>
                    </div>

                    <div className="flex-1 text-right">
                      <p className="text-xs text-slate-400 font-semibold">Success Ratio</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {habit.completionPercentage}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7 Days Timeline check-in grid */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                    Last 7 Days Check-in
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    {weekTimeline.map((day) => {
                      const completed = habit.history?.some(
                        (item) => item.date === day.dateStr && item.completed
                      );

                      const isToday = day.dateStr === todayStr;
                      const isDisabled = !isToday || completed;

                      return (
                        <button
                          key={day.dateStr}
                          disabled={isDisabled || togglingId !== null}
                          onClick={() => handleToggleDate(habit._id, day.dateStr)}
                          className={`
                            flex flex-col items-center p-2 rounded-xl transition w-10
                            ${
                              completed
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 opacity-100'
                                : 'bg-slate-100 dark:bg-slate-800/40 text-slate-400'
                            }
                            ${isToday && !completed ? 'active:scale-90 cursor-pointer ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-dark-950' : ''}
                            ${isDisabled || togglingId !== null ? 'cursor-not-allowed opacity-60' : ''}
                          `}
                          title={completed ? 'Completed' : isToday ? 'Click to complete today' : 'Past date (Read-only)'}
                        >
                          <span className="text-[10px] uppercase font-bold">{day.label}</span>
                          <span className="text-xs font-extrabold mt-1">{day.dayNum}</span>
                          <span className="mt-1.5 flex items-center justify-center min-h-[14px]">
                            {togglingId === habit._id && isToday ? (
                              <Loader2 size={14} className="animate-spin text-brand-500" />
                            ) : completed ? (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            ) : (
                              <XCircle size={14} className="text-slate-300 dark:text-slate-700" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 dark:bg-dark-900/40 rounded-2xl text-slate-400">
          No habits configured. Create your first habit (e.g. Save ₹100 daily) to begin building streaks!
        </div>
      )}

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <GlassCard className="w-full max-w-md p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Habit Details' : 'Create New Habit'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-xl text-xs border border-rose-100 dark:border-rose-950/30">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Habit Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Save ₹100, Track Expenses, Skip coffee purchase"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Frequency *</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="glass-input text-sm"
                    required
                  >
                    <option value="daily">Daily check-in</option>
                    <option value="weekly">Weekly check-in</option>
                    <option value="monthly">Monthly check-in</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Target (Count/Amount) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 1"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="glass-input text-sm"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                <textarea
                  placeholder="e.g. Save money by packing lunch instead of ordering out"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input text-sm h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {editingId ? 'Saving...' : 'Creating...'}
                  </>
                ) : (
                  editingId ? 'Save Changes' : 'Launch Habit'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Habits;
