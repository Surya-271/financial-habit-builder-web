import React, { useEffect, useState } from 'react';
import { expenseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  Tag,
  Loader2,
  AlertCircle,
  X,
  TrendingDown,
  AlertTriangle,
} from 'lucide-react';

const Expenses = () => {
  const { user, updateProfile } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Budget management states
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [isSavingBudget, setIsSavingBudget] = useState(false);

  const openBudgetEdit = () => {
    setBudgetAmount(user?.profile?.monthlyBudget || '');
    setBudgetError('');
    setBudgetModalOpen(true);
  };

  const handleBudgetSave = async (e) => {
    e.preventDefault();
    if (isSavingBudget) return;
    setBudgetError('');

    const budgetVal = Number(budgetAmount);
    if (!budgetAmount || isNaN(budgetVal) || budgetVal <= 0) {
      setBudgetError('Monthly budget must be greater than zero.');
      return;
    }

    const payload = {
      name: user.name,
      email: user.email,
      profile: {
        ...user.profile,
        monthlyBudget: budgetVal,
      },
    };

    setIsSavingBudget(true);
    try {
      const res = await updateProfile(payload);
      if (res.success) {
        setBudgetModalOpen(false);
      }
    } catch (err) {
      setBudgetError(err.message || 'Failed to update monthly budget.');
    } finally {
      setIsSavingBudget(false);
    }
  };

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await expenseAPI.getAll();
      if (res.data.success) {
        setExpenses(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch expense records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().substring(0, 10));
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(new Date(expense.date).toISOString().substring(0, 10));
    setDescription(expense.description || '');
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    if (!title || !amount || !category || !date) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      title,
      amount: Number(amount),
      category,
      date,
      description,
    };

    setIsSaving(true);
    try {
      if (editingId) {
        const res = await expenseAPI.update(editingId, payload);
        if (res.data.success) {
          setExpenses(expenses.map(exp => (exp._id === editingId ? res.data.data : exp)));
        }
      } else {
        const res = await expenseAPI.create(payload);
        if (res.data.success) {
          setExpenses([res.data.data, ...expenses]);
        }
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (deletingId) return;
    if (!window.confirm('Are you sure you want to delete this expense record?')) return;
    setDeletingId(id);
    try {
      const res = await expenseAPI.delete(id);
      if (res.data.success) {
        setExpenses(expenses.filter(exp => exp._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  // Calculations for current month's expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const totalCurrentMonthSpending = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalOutflow = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyBudgetSetting = user?.profile?.monthlyBudget || 0;
  const budgetExceeded = monthlyBudgetSetting > 0 && totalCurrentMonthSpending > monthlyBudgetSetting;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <TrendingDown className="text-rose-500" />
            Expense Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Keep track of your expenditures, categorized for deep analytics.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          Log Expense
        </button>
      </div>

      {/* Budget Limit Warning Banner */}
      {budgetExceeded && (
        <div className="flex items-start gap-4 p-5 bg-rose-500/10 border border-rose-500/20 dark:border-rose-400/10 text-rose-650 dark:text-rose-400 rounded-2xl animate-pulse">
          <AlertTriangle size={24} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Monthly Budget Warning</h4>
            <p className="text-xs mt-1 font-semibold">
              You have exceeded your monthly budget.
            </p>
          </div>
        </div>
      )}

      {/* Overview widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Expenses logged
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {currencySymbol}
              {totalOutflow.toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-amber-500/10 text-amber-500 rounded-2xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Spent This Month
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {currencySymbol}
              {totalCurrentMonthSpending.toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between hover:translate-y-0" hover={false}>
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Budget
              </p>
              <button
                onClick={openBudgetEdit}
                className="text-[11px] font-bold text-brand-500 hover:text-brand-400 transition"
              >
                Edit Budget
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {monthlyBudgetSetting > 0
                ? `${currencySymbol}${monthlyBudgetSetting.toLocaleString()}`
                : 'Not Set'}
            </h3>

            {monthlyBudgetSetting > 0 && (
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Spent: <strong className="text-slate-700 dark:text-slate-200">{currencySymbol}{totalCurrentMonthSpending.toLocaleString()}</strong></span>
                  <span>Remaining: <strong className={totalCurrentMonthSpending > monthlyBudgetSetting ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{currencySymbol}{Math.max(0, monthlyBudgetSetting - totalCurrentMonthSpending).toLocaleString()}</strong></span>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        totalCurrentMonthSpending > monthlyBudgetSetting ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-500 to-indigo-650'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((totalCurrentMonthSpending / monthlyBudgetSetting) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 mt-1.5">
                    <span>{Math.round((totalCurrentMonthSpending / monthlyBudgetSetting) * 100)}% utilized</span>
                    <span className="flex items-center gap-1">
                      {totalCurrentMonthSpending < monthlyBudgetSetting && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                          ✓ Within Budget
                        </span>
                      )}
                      {totalCurrentMonthSpending === monthlyBudgetSetting && (
                        <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5">
                          ⚠ Budget Fully Utilized
                        </span>
                      )}
                      {totalCurrentMonthSpending > monthlyBudgetSetting && (
                        <span className="text-rose-600 dark:text-rose-455 font-bold flex items-center gap-0.5 animate-pulse">
                          ✖ Budget Exceeded
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Expense History Table */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Expense Records</h3>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={32} className="animate-spin text-brand-500" />
          </div>
        ) : expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                {expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {exp.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-100 dark:text-rose-350 dark:bg-rose-950/40 rounded-full">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-slate-400 max-w-[200px] truncate">
                      {exp.description || '-'}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-rose-600 dark:text-rose-455">
                      {currencySymbol}
                      {exp.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          disabled={deletingId !== null}
                          className="p-1.5 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(exp._id)}
                          disabled={deletingId !== null}
                          className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === exp._id ? (
                            <Loader2 size={16} className="animate-spin text-rose-500" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            No expenses recorded yet. Click "Log Expense" to check-in your first outlay.
          </div>
        )}
      </GlassCard>

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <GlassCard className="w-full max-w-md p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingId ? 'Edit Expense Entry' : 'Log New Expense'}
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
                <label className="text-xs font-semibold text-slate-500 uppercase">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Grocery Shop, Electricity bill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Amount ({currencySymbol}) *</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="glass-input text-sm"
                    min="0"
                    step="any"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="glass-input text-sm"
                  >
                    <option value="Food">Food</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Transport">Transport</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Education">Education</option>
                    <option value="Investment">Investment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                <textarea
                  placeholder="Optional details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="glass-input text-sm h-20 resize-none"
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
                    {editingId ? 'Saving...' : 'Adding...'}
                  </>
                ) : (
                  editingId ? 'Save Changes' : 'Log Transaction'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Edit Budget Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setBudgetModalOpen(false)} />
          <GlassCard className="w-full max-w-sm p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                Edit Monthly Budget
              </h3>
              <button
                onClick={() => setBudgetModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {budgetError && (
              <div className="mb-4 flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 rounded-xl text-xs border border-rose-100 dark:border-rose-950/30">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{budgetError}</span>
              </div>
            )}

            <form onSubmit={handleBudgetSave} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Monthly Budget ({currencySymbol})
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="glass-input text-sm"
                  min="1"
                  step="any"
                  required
                  autoFocus
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setBudgetModalOpen(false)}
                  disabled={isSavingBudget}
                  className="flex-1 btn-secondary py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBudget}
                  className="flex-1 btn-primary py-2 text-sm font-semibold flex items-center justify-center gap-2"
                >
                  {isSavingBudget ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Expenses;
