import React, { useEffect, useState } from 'react';
import { savingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Target,
  Loader2,
  AlertCircle,
  X,
  Coins,
  CheckCircle,
} from 'lucide-react';

const Savings = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [fundsModalOpen, setFundsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  // Goal CRUD states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('Emergency Fund');
  const [deadline, setDeadline] = useState('');

  // Add funds state
  const [fundsAmount, setFundsAmount] = useState('');

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await savingsAPI.getAll();
      if (res.data.success) {
        setGoals(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve savings goals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setCategory('Emergency Fund');
    setDeadline('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingId(goal._id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount);
    setCurrentAmount(goal.currentAmount);
    setCategory(goal.category);
    setDeadline(new Date(goal.deadline).toISOString().substring(0, 10));
    setError('');
    setModalOpen(true);
  };

  const openFundsModal = (goal) => {
    setSelectedGoal(goal);
    setFundsAmount('');
    setError('');
    setFundsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    if (!name || !targetAmount || !deadline) {
      setError('Please provide goal name, target, and deadline.');
      return;
    }

    const current = Number(currentAmount) || 0;
    const target = Number(targetAmount);

    if (current > target) {
      setError('Initial savings cannot exceed the target amount.');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const goalDeadline = new Date(deadline);
    if (goalDeadline < today) {
      setError('Deadline cannot be in the past.');
      return;
    }

    const payload = {
      name,
      targetAmount: target,
      currentAmount: current,
      category,
      deadline,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await savingsAPI.update(editingId, payload);
        if (res.data.success) {
          // Re-load goals to recalculate virtual properties correctly
          await fetchGoals();
        }
      } else {
        const res = await savingsAPI.create(payload);
        if (res.data.success) {
          await fetchGoals();
        }
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    if (!fundsAmount || Number(fundsAmount) <= 0) {
      setError('Please enter a positive amount to save.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await savingsAPI.addFunds(selectedGoal._id, Number(fundsAmount));
      if (res.data.success) {
        await fetchGoals();
        setFundsModalOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    if (!window.confirm('Are you sure you want to delete this savings goal?')) return;
    setDeletingId(id);
    try {
      const res = await savingsAPI.delete(id);
      if (res.data.success) {
        setGoals(goals.filter(g => g._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (deadlineDate) => {
    const diffTime = new Date(deadlineDate) - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days remaining`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Target className="text-brand-500" />
            Savings Targets
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Build targets for emergency reserves, purchases, vehicles, or vacations.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          Establish Goal
        </button>
      </div>

      {/* Main goals view */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={36} className="animate-spin text-brand-500" />
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const isCompleted = goal.status === 'completed';
            const daysLeft = getDaysRemaining(goal.deadline);

            return (
              <GlassCard key={goal._id} className="p-6 flex flex-col justify-between" hover={true}>
                <div>
                  {/* Category and Actions */}
                  <div className="flex justify-between items-start">
                    <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-brand-600 bg-brand-100 dark:text-brand-300 dark:bg-brand-900/40 rounded-md">
                      {goal.category}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditModal(goal)}
                        disabled={deletingId !== null}
                        className="p-1 text-slate-400 hover:text-brand-500 transition disabled:opacity-50"
                        title="Edit Target"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(goal._id)}
                        disabled={deletingId !== null}
                        className="p-1 text-slate-400 hover:text-rose-500 transition disabled:opacity-50"
                        title="Delete Target"
                      >
                        {deletingId === goal._id ? (
                          <Loader2 size={15} className="animate-spin text-rose-500" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Goal title */}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-4">
                    {goal.name}
                  </h3>

                  {/* Completion badge */}
                  {isCompleted && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mt-2">
                      <CheckCircle size={14} />
                      Completed!
                    </div>
                  )}

                  {/* Goal numbers */}
                  <div className="flex justify-between items-end mt-6">
                    <div>
                      <p className="text-xs text-slate-400">Saved</p>
                      <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                        {currencySymbol}
                        {goal.currentAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Target</p>
                      <p className="font-extrabold text-sm text-slate-500 dark:text-slate-400">
                        {currencySymbol}
                        {goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Visual Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-2">
                      <span>{goal.progressPercent}% completed</span>
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {daysLeft}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add Funds footer button */}
                {!isCompleted && (
                  <button
                    onClick={() => openFundsModal(goal)}
                    disabled={deletingId !== null || isSaving}
                    className="mt-6 w-full btn-secondary py-2 flex items-center justify-center gap-2 text-xs font-bold disabled:opacity-50"
                  >
                    <Coins size={14} />
                    Allocate Savings
                  </button>
                )}
              </GlassCard>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 dark:bg-dark-900/40 rounded-2xl text-slate-400">
          No savings goals created yet. Click "Establish Goal" to configure your first savings target!
        </div>
      )}

      {/* Modal Dialog for Goal Creation/Edition */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <GlassCard className="w-full max-w-md p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Savings Goal' : 'Establish New Savings Target'}
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
                <label className="text-xs font-semibold text-slate-500 uppercase">Goal Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Emergency Fund, New Macbook Pro"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Target Amount *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="glass-input text-sm"
                    min="1"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Initial Savings</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="glass-input text-sm"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input text-sm"
                  >
                    <option value="Emergency Fund">Emergency Fund</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Bike">Bike</option>
                    <option value="Education">Education</option>
                    <option value="Home">Home</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Deadline *</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Target Details'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Modal Dialog for Allocating Funds */}
      {fundsModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setFundsModalOpen(false)} />
          <GlassCard className="w-full max-w-sm p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Allocate Funds: {selectedGoal.name}
              </h3>
              <button
                onClick={() => setFundsModalOpen(false)}
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

            <form onSubmit={handleAddFundsSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Deposit Amount ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={fundsAmount}
                  onChange={(e) => setFundsAmount(e.target.value)}
                  className="glass-input text-sm"
                  min="1"
                  required
                  autoFocus
                />
              </div>

              <div className="text-xs text-slate-400">
                This will increase your current savings towards this goal by the specified amount.
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full btn-primary py-2.5 mt-2 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Confirm Allocation'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Savings;
