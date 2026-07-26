import React, { useEffect, useState } from 'react';
import { incomeAPI } from '../services/api';
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
  Wallet,
} from 'lucide-react';

const Income = () => {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Currency formatting
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await incomeAPI.getAll();
      if (res.data.success) {
        setIncomes(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch income logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setAmount('');
    setCategory('Salary');
    setDate(new Date().toISOString().substring(0, 10));
    setDescription('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (income) => {
    setEditingId(income._id);
    setTitle(income.title);
    setAmount(income.amount);
    setCategory(income.category);
    setDate(new Date(income.date).toISOString().substring(0, 10));
    setDescription(income.description || '');
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
        const res = await incomeAPI.update(editingId, payload);
        if (res.data.success) {
          setIncomes(incomes.map(i => (i._id === editingId ? res.data.data : i)));
        }
      } else {
        const res = await incomeAPI.create(payload);
        if (res.data.success) {
          setIncomes([res.data.data, ...incomes]);
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
    if (!window.confirm('Are you sure you want to delete this income entry?')) return;
    setDeletingId(id);
    try {
      const res = await incomeAPI.delete(id);
      if (res.data.success) {
        setIncomes(incomes.filter(i => i._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalInflow = incomes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Wallet className="text-brand-500" />
            Income Manager
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor and record all source earnings and financial inflows.
          </p>
        </div>
        <button onClick={openAddModal} className="btn-primary">
          <Plus size={18} />
          Record Income
        </button>
      </div>

      {/* Overview Aggregators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Recorded Income
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {currencySymbol}
              {totalInflow.toLocaleString()}
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
            <Tag size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Income Sources
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {[...new Set(incomes.map(i => i.category))].length} Categories
            </h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex items-center gap-5">
          <div className="p-4 bg-purple-500/10 text-purple-500 rounded-2xl">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Recent Log Date
            </p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
              {incomes.length > 0
                ? new Date(incomes[0].date).toLocaleDateString()
                : 'No Logs'}
            </h3>
          </div>
        </GlassCard>
      </div>

      {/* Main content grid */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Transaction Logs</h3>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={32} className="animate-spin text-brand-500" />
          </div>
        ) : incomes.length > 0 ? (
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
                {incomes.map((inc) => (
                  <tr
                    key={inc._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {inc.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-semibold text-emerald-600 bg-emerald-100 dark:text-emerald-350 dark:bg-emerald-950/40 rounded-full">
                        {inc.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-slate-400 max-w-[200px] truncate">
                      {inc.description || '-'}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {currencySymbol}
                      {inc.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(inc)}
                          disabled={deletingId !== null}
                          className="p-1.5 text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(inc._id)}
                          disabled={deletingId !== null}
                          className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === inc._id ? (
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
            No income transactions recorded yet. Click "Record Income" to get started.
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
                {editingId ? 'Edit Income Record' : 'Record New Income'}
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
                  placeholder="e.g. Salary, Dividend Payment"
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
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Business">Business</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Refunds">Refunds</option>
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
                  editingId ? 'Save Changes' : 'Record Transaction'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Income;
