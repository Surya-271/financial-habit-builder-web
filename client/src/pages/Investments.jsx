import React, { useEffect, useState } from 'react';
import { wealthAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import {
  Plus,
  Trash2,
  Edit2,
  Coins,
  ShieldAlert,
  Loader2,
  AlertCircle,
  X,
  TrendingUp,
  Landmark,
  PiggyBank,
} from 'lucide-react';

const Investments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'assets'

  // Modal forms states
  const [invModalOpen, setInvModalOpen] = useState(false);
  const [assetModalOpen, setAssetModalOpen] = useState(false);

  // Investment Form
  const [editingInvId, setEditingInvId] = useState(null);
  const [invName, setInvName] = useState('');
  const [invType, setInvType] = useState('Stocks');
  const [invAmount, setInvAmount] = useState('');
  const [invCurrentValue, setInvCurrentValue] = useState('');
  const [invPurchaseDate, setInvPurchaseDate] = useState('');
  const [invDesc, setInvDesc] = useState('');

  // Asset Form
  const [editingAssetId, setEditingAssetId] = useState(null);
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Asset'); // 'Asset' or 'Liability'
  const [assetCategory, setAssetCategory] = useState('Cash & Bank Accounts');
  const [assetValue, setAssetValue] = useState('');

  // Currency helper
  const getSymbol = (code) => {
    if (code === 'INR') return '₹';
    if (code === 'USD') return '$';
    if (code === 'EUR') return '€';
    return code || '₹';
  };
  const currencySymbol = getSymbol(user?.profile?.currency);

  const fetchData = async () => {
    try {
      setLoading(true);
      const invRes = await wealthAPI.getInvestments();
      const assetRes = await wealthAPI.getAssets();
      if (invRes.data.success && assetRes.data.success) {
        setInvestments(invRes.data.data);
        setAssets(assetRes.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch holdings data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Investment Modals triggers
  const openAddInv = () => {
    setEditingInvId(null);
    setInvName('');
    setInvType('Stocks');
    setInvAmount('');
    setInvCurrentValue('');
    setInvPurchaseDate(new Date().toISOString().substring(0, 10));
    setInvDesc('');
    setError('');
    setInvModalOpen(true);
  };

  const openEditInv = (inv) => {
    setEditingInvId(inv._id);
    setInvName(inv.name);
    setInvType(inv.type);
    setInvAmount(inv.amountInvested);
    setInvCurrentValue(inv.currentValue);
    setInvPurchaseDate(new Date(inv.purchaseDate).toISOString().substring(0, 10));
    setInvDesc(inv.description || '');
    setError('');
    setInvModalOpen(true);
  };

  const handleInvSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    if (!invName || !invType || invAmount === '' || invCurrentValue === '') {
      setError('Please fill in all required fields.');
      return;
    }

    const trimmedName = invName ? invName.trim() : '';
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      setError('Asset name must be between 3 and 100 characters.');
      return;
    }

    const amt = Number(invAmount);
    if (isNaN(amt) || amt <= 0) {
      setError('Invested amount must be greater than zero.');
      return;
    }

    const val = Number(invCurrentValue);
    if (isNaN(val) || val < 0) {
      setError('Current value cannot be negative.');
      return;
    }

    if (invPurchaseDate) {
      const pDate = new Date(invPurchaseDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (pDate > today) {
        setError('Purchase date cannot be in the future.');
        return;
      }
    }

    const payload = {
      name: trimmedName,
      type: invType,
      amountInvested: amt,
      currentValue: val,
      purchaseDate: invPurchaseDate,
      description: invDesc,
    };

    setIsSaving(true);
    try {
      if (editingInvId) {
        const res = await wealthAPI.updateInvestment(editingInvId, payload);
        if (res.data.success) {
          setInvestments(investments.map(i => (i._id === editingInvId ? res.data.data : i)));
        }
      } else {
        const res = await wealthAPI.createInvestment(payload);
        if (res.data.success) {
          setInvestments([res.data.data, ...investments]);
        }
      }
      setInvModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save investment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvDelete = async (id) => {
    if (deletingId) return;
    if (!window.confirm('Delete this investment record?')) return;
    setDeletingId(id);
    try {
      const res = await wealthAPI.deleteInvestment(id);
      if (res.data.success) {
        setInvestments(investments.filter(i => i._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  // Asset Modals triggers
  const openAddAsset = () => {
    setEditingAssetId(null);
    setAssetName('');
    setAssetType('Asset');
    setAssetCategory('Cash & Bank Accounts');
    setAssetValue('');
    setError('');
    setAssetModalOpen(true);
  };

  const openEditAsset = (asset) => {
    setEditingAssetId(asset._id);
    setAssetName(asset.name);
    setAssetType(asset.type);
    setAssetCategory(asset.category);
    setAssetValue(asset.value);
    setError('');
    setAssetModalOpen(true);
  };

  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setError('');

    if (!assetName || !assetType || !assetCategory || assetValue === '') {
      setError('Please fill in all required fields.');
      return;
    }

    const trimmedName = assetName ? assetName.trim() : '';
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      setError('Asset name must be between 3 and 100 characters.');
      return;
    }

    const val = Number(assetValue);
    if (isNaN(val) || val < 0) {
      setError('Value cannot be negative.');
      return;
    }

    const payload = {
      name: trimmedName,
      type: assetType,
      category: assetCategory,
      value: val,
    };

    setIsSaving(true);
    try {
      if (editingAssetId) {
        const res = await wealthAPI.updateAsset(editingAssetId, payload);
        if (res.data.success) {
          setAssets(assets.map(a => (a._id === editingAssetId ? res.data.data : a)));
        }
      } else {
        const res = await wealthAPI.createAsset(payload);
        if (res.data.success) {
          setAssets([res.data.data, ...assets]);
        }
      }
      setAssetModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save asset record.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssetDelete = async (id) => {
    if (deletingId) return;
    if (!window.confirm('Delete this asset/liability entry?')) return;
    setDeletingId(id);
    try {
      const res = await wealthAPI.deleteAsset(id);
      if (res.data.success) {
        setAssets(assets.filter(a => a._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  // Sum aggregates
  const totalPrincipal = investments.reduce((acc, curr) => acc + curr.amountInvested, 0);
  const totalCurrentValue = investments.reduce((acc, curr) => acc + curr.currentValue, 0);
  const totalGrowth = totalCurrentValue - totalPrincipal;

  const totalAssets = assets.filter(a => a.type === 'Asset').reduce((acc, curr) => acc + curr.value, 0);
  const totalLiabilities = assets.filter(a => a.type === 'Liability').reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
            <Coins className="text-brand-500" />
            Holdings & Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Log investments and verify assets against outstanding debts (liabilities).
          </p>
        </div>
        <button
          onClick={activeTab === 'portfolio' ? openAddInv : openAddAsset}
          className="btn-primary"
        >
          <Plus size={18} />
          {activeTab === 'portfolio' ? 'Add Investment' : 'Add Asset/Liability'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === 'portfolio'
              ? 'text-brand-500 font-extrabold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Investments Portfolio
          {activeTab === 'portfolio' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-4 text-sm font-bold transition-all relative ${
            activeTab === 'assets' ? 'text-brand-500 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          Assets & Liabilities (Balance Sheet)
          {activeTab === 'assets' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 size={36} className="animate-spin text-brand-500" />
        </div>
      ) : activeTab === 'portfolio' ? (
        /* ==================== PORTFOLIO TAB ==================== */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 flex items-center gap-5">
              <div className="p-4 bg-brand-500/10 text-brand-500 rounded-2xl">
                <PiggyBank size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Invested Cost Basis</p>
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
                  {currencySymbol}
                  {totalPrincipal.toLocaleString()}
                </h3>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex items-center gap-5">
              <div className="p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Current Portfolio Valuation</p>
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
                  {currencySymbol}
                  {totalCurrentValue.toLocaleString()}
                </h3>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Coins size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Portfolio Returns</p>
                <h3
                  className={`text-2xl font-bold mt-1 ${
                    totalGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {totalGrowth >= 0 ? '+' : ''}
                  {currencySymbol}
                  {totalGrowth.toLocaleString()}
                </h3>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-850 dark:text-white">Active Investments</h3>
            {investments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs text-slate-400 font-semibold uppercase">
                      <th className="py-3 px-4">Asset Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Purchase Date</th>
                      <th className="py-3 px-4 text-right">Cost Basis</th>
                      <th className="py-3 px-4 text-right">Current Value</th>
                      <th className="py-3 px-4 text-right">Net Return</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {investments.map((inv) => {
                      const net = inv.currentValue - inv.amountInvested;
                      return (
                        <tr key={inv._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                          <td className="py-4 px-4 font-semibold text-slate-850 dark:text-slate-200">
                            {inv.name}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-semibold text-brand-600 bg-brand-50 dark:text-brand-350 dark:bg-brand-950/40 rounded-full">
                              {inv.type}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-400">
                            {new Date(inv.purchaseDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-slate-500">
                            {currencySymbol}
                            {inv.amountInvested.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-slate-850 dark:text-slate-100">
                            {currencySymbol}
                            {inv.currentValue.toLocaleString()}
                          </td>
                          <td
                            className={`py-4 px-4 text-right font-bold ${
                              net >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {net >= 0 ? '+' : ''}
                            {currencySymbol}
                            {net.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditInv(inv)}
                                disabled={deletingId !== null}
                                className="p-1 hover:text-brand-500 transition disabled:opacity-50"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleInvDelete(inv._id)}
                                disabled={deletingId !== null}
                                className="p-1 hover:text-rose-500 transition disabled:opacity-50"
                              >
                                {deletingId === inv._id ? (
                                  <Loader2 size={15} className="animate-spin text-rose-500" />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-400">
                No investment positions logged. Click "Add Investment" to seed your portfolio.
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        /* ==================== ASSETS TAB ==================== */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 flex items-center gap-5">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Landmark size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Capital Assets Value</p>
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
                  {currencySymbol}
                  {totalAssets.toLocaleString()}
                </h3>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex items-center gap-5">
              <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl">
                <ShieldAlert size={24} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Total Debt liabilities</p>
                <h3 className="text-2xl font-bold text-slate-850 dark:text-white mt-1">
                  {currencySymbol}
                  {totalLiabilities.toLocaleString()}
                </h3>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-850 dark:text-white font-sans">
              Capital Assets & Debt Checklist
            </h3>
            {assets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-850 text-xs text-slate-400 font-semibold uppercase">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4 text-right">Valuation / Debt Balance</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                    {assets.map((ast) => (
                      <tr key={ast._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                        <td className="py-4 px-4 font-semibold text-slate-850 dark:text-slate-200">
                          {ast.name}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                              ast.type === 'Asset'
                                ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-350 dark:bg-emerald-950/40'
                                : 'text-rose-600 bg-rose-100 dark:text-rose-350 dark:bg-rose-950/40'
                            }`}
                          >
                            {ast.type}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-400">{ast.category}</td>
                        <td
                          className={`py-4 px-4 text-right font-bold ${
                            ast.type === 'Asset' ? 'text-emerald-600' : 'text-rose-605 text-rose-600'
                          }`}
                        >
                          {currencySymbol}
                          {ast.value.toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openEditAsset(ast)}
                              disabled={deletingId !== null}
                              className="p-1 hover:text-brand-500 transition disabled:opacity-50"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => handleAssetDelete(ast._id)}
                              disabled={deletingId !== null}
                              className="p-1 hover:text-rose-500 transition disabled:opacity-50"
                            >
                              {deletingId === ast._id ? (
                                <Loader2 size={15} className="animate-spin text-rose-500" />
                              ) : (
                                <Trash2 size={15} />
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
                No asset or liability accounts added yet. Click "Add Asset/Liability" to build your ledger.
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* INVESTMENT MODAL */}
      {invModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setInvModalOpen(false)} />
          <GlassCard className="w-full max-w-md p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingInvId ? 'Edit Investment Details' : 'Add Investment Position'}
              </h3>
              <button
                onClick={() => setInvModalOpen(false)}
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

            <form onSubmit={handleInvSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Investment Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Nifty 50 Index Fund, Tesla Stock"
                  value={invName}
                  onChange={(e) => setInvName(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Instrument Type *</label>
                  <select
                    value={invType}
                    onChange={(e) => setInvType(e.target.value)}
                    className="glass-input text-sm"
                  >
                    <option value="Stocks">Stocks</option>
                    <option value="Mutual Funds">Mutual Funds</option>
                    <option value="Bonds">Bonds</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Fixed Deposit">Fixed Deposit</option>
                    <option value="Gold">Gold</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Purchase Date *</label>
                  <input
                    type="date"
                    value={invPurchaseDate}
                    onChange={(e) => setInvPurchaseDate(e.target.value)}
                    className="glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Amount Invested *</label>
                  <input
                    type="number"
                    placeholder="Cost basis"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    className="glass-input text-sm"
                    min="0"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Current Value *</label>
                  <input
                    type="number"
                    placeholder="Market valuation"
                    value={invCurrentValue}
                    onChange={(e) => setInvCurrentValue(e.target.value)}
                    className="glass-input text-sm"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Comments/Desc</label>
                <textarea
                  placeholder="Purchase notes..."
                  value={invDesc}
                  onChange={(e) => setInvDesc(e.target.value)}
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
                    Saving...
                  </>
                ) : (
                  'Save Investment Details'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* ASSET MODAL */}
      {assetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-dark-950/40 backdrop-blur-sm" onClick={() => setAssetModalOpen(false)} />
          <GlassCard className="w-full max-w-md p-6 relative z-10 animate-scale-up" hover={false}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {editingAssetId ? 'Edit Asset Ledger Entry' : 'Add Balance Sheet Account'}
              </h3>
              <button
                onClick={() => setAssetModalOpen(false)}
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

            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Account / Asset Name *</label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Savings Bank, Apartment valuation, SBI Car Loan"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="glass-input text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Classification *</label>
                  <select
                    value={assetType}
                    onChange={(e) => {
                      setAssetType(e.target.value);
                      // Set default category according to type
                      setAssetCategory(
                        e.target.value === 'Asset'
                          ? 'Cash & Bank Accounts'
                          : 'Credit Card Debt'
                      );
                    }}
                    className="glass-input text-sm"
                  >
                    <option value="Asset">Asset (Positive Net Worth)</option>
                    <option value="Liability">Liability (Negative Debt)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Category *</label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value)}
                    className="glass-input text-sm"
                  >
                    {assetType === 'Asset' ? (
                      <>
                        <option value="Cash & Bank Accounts">Cash & Bank Accounts</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Vehicles">Vehicles</option>
                        <option value="Gold & Jewelry">Gold & Jewelry</option>
                        <option value="Equipment">Equipment</option>
                        <option value="Other">Other Asset</option>
                      </>
                    ) : (
                      <>
                        <option value="Credit Card Debt">Credit Card Debt</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Mortgage">Mortgage</option>
                        <option value="Student Loan">Student Loan</option>
                        <option value="Other">Other Debt</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-500 uppercase">Valuation ({currencySymbol}) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={assetValue}
                  onChange={(e) => setAssetValue(e.target.value)}
                  className="glass-input text-sm"
                  min="0"
                  required
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
                    Saving...
                  </>
                ) : (
                  'Save Account Details'
                )}
              </button>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default Investments;
