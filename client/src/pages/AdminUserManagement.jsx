import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import GlassCard from '../components/GlassCard';
import {
  Users,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  UserCheck,
  UserX,
  Trash2,
  Loader2,
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Wallet,
  TrendingDown,
  Coins,
  Target,
  CalendarDays,
  MessageSquare,
} from 'lucide-react';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'suspended'
  const [verificationFilter, setVerificationFilter] = useState('all'); // 'all', 'verified', 'unverified'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'name-asc', 'name-desc'

  // User details modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [userDetailsData, setUserDetailsData] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch system users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id) => {
    if (togglingId) return;
    setTogglingId(id);
    try {
      const res = await adminAPI.toggleUserStatus(id);
      if (res.data.success) {
        setUsers(
          users.map((u) => (u._id === id ? { ...u, status: res.data.data.status } : u))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    if (deletingId) return;
    if (
      !window.confirm(
        'WARNING: This will permanently delete the user account and all of their financial transactions (incomes, expenses, habits, investments). This action CANNOT be undone. Proceed?'
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await adminAPI.deleteUser(id);
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== id));
      }
    } catch (err) {
      alert('Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenDetails = async (usr) => {
    setSelectedUser(usr);
    setUserDetailsData(null);
    try {
      setDetailsLoading(true);
      const res = await adminAPI.getUserDetails(usr._id);
      if (res.data.success) {
        setUserDetailsData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user details:', err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const isUserVerified = (usr) => {
    return Boolean(usr.isVerified || usr.firebaseUid);
  };

  // Filter & Sort Logic
  const filteredUsers = users
    .filter((usr) => {
      // Search check
      const query = searchTerm.toLowerCase().trim();
      const nameMatch = usr.name ? usr.name.toLowerCase().includes(query) : false;
      const emailMatch = usr.email ? usr.email.toLowerCase().includes(query) : false;
      const idMatch = usr._id ? usr._id.toLowerCase().includes(query) : false;
      const matchesSearch = query === '' || nameMatch || emailMatch || idMatch;

      // Status check
      const matchesStatus =
        statusFilter === 'all' || usr.status === statusFilter;

      // Verification check
      const verified = isUserVerified(usr);
      const matchesVerification =
        verificationFilter === 'all' ||
        (verificationFilter === 'verified' && verified) ||
        (verificationFilter === 'unverified' && !verified);

      return matchesSearch && matchesStatus && matchesVerification;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-3">
          <Users className="text-purple-600" />
          User Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review system users, toggle security suspensions, or inspect detailed account telemetry.
        </p>
      </div>

      {/* Search, Filter & Sort Controls */}
      <GlassCard className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-11 py-2 text-sm"
          />
        </div>

        {/* Filter and Sort controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/30 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Filter size={14} className="text-purple-500" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-bold text-purple-600 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/30 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <ShieldCheck size={14} className="text-purple-500" />
            <span>Verification:</span>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-bold text-purple-600 cursor-pointer"
            >
              <option value="all">All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/30 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <ArrowUpDown size={14} className="text-purple-500" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-bold text-purple-600 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Main Table */}
      <GlassCard className="p-6">
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 size={32} className="animate-spin text-purple-600" />
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center">{error}</div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-semibold uppercase">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Verified</th>
                  <th className="py-3 px-4">Register Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredUsers.map((usr) => {
                  const verified = isUserVerified(usr);
                  return (
                    <tr key={usr._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/15">
                      <td className="py-4 px-4 font-semibold text-slate-850 dark:text-slate-200">
                        {usr.name}
                      </td>
                      <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{usr.email}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            verified
                              ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-350 dark:bg-emerald-950/30'
                              : 'text-amber-600 bg-amber-50 dark:text-amber-350 dark:bg-amber-950/30'
                          }`}
                        >
                          {verified ? (
                            <>
                              <CheckCircle2 size={12} /> Verified
                            </>
                          ) : (
                            <>
                              <XCircle size={12} /> Unverified
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(usr.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                            usr.status === 'active'
                              ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-350 dark:bg-emerald-950/40'
                              : 'text-rose-600 bg-rose-100 dark:text-rose-350 dark:bg-rose-950/40'
                          }`}
                        >
                          {usr.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          {/* View Details Action */}
                          <button
                            onClick={() => handleOpenDetails(usr)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-purple-900/30 dark:hover:bg-purple-950/20 transition"
                            title="View Account Telemetry"
                          >
                            <Eye size={13} />
                            Details
                          </button>

                          {/* Suspend/Activate Action */}
                          <button
                            onClick={() => handleToggleStatus(usr._id)}
                            disabled={togglingId !== null || deletingId !== null}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-50 ${
                              usr.status === 'active'
                                ? 'text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/30 dark:hover:bg-rose-950/20'
                                : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20'
                            }`}
                            title={usr.status === 'active' ? 'Suspend User' : 'Activate User'}
                          >
                            {togglingId === usr._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : usr.status === 'active' ? (
                              <>
                                <UserX size={13} />
                                Suspend
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} />
                                Activate
                              </>
                            )}
                          </button>

                          {/* Delete Action */}
                          <button
                            onClick={() => handleDeleteUser(usr._id)}
                            disabled={togglingId !== null || deletingId !== null}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition disabled:opacity-50"
                            title="Purge User Account"
                          >
                            {deletingId === usr._id ? (
                              <Loader2 size={14} className="animate-spin text-rose-500" />
                            ) : (
                              <Trash2 size={14} />
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
            {searchTerm || statusFilter !== 'all' || verificationFilter !== 'all'
              ? 'No matching users found.'
              : 'No users found registered.'}
          </div>
        )}
      </GlassCard>

      {/* READ-ONLY USER DETAILS MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <GlassCard className="w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-lg">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-850 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">ID: {selectedUser._id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="py-12 flex justify-center">
                <Loader2 size={32} className="animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. User Information */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    User Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl">
                    <div>
                      <span className="text-xs text-slate-400">Email Address</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedUser.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Account Status</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{selectedUser.status}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Verification Status</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {isUserVerified(selectedUser) ? 'Verified' : 'Unverified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Preferred Currency</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedUser.profile?.currency || 'INR'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400">Registration Date</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Financial Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Financial Summary
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-500/10 rounded-xl">
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase">
                        <Wallet size={14} /> Total Income
                      </div>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                        ₹{(userDetailsData?.totalIncome || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-rose-500/10 rounded-xl">
                      <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase">
                        <TrendingDown size={14} /> Total Expense
                      </div>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                        ₹{(userDetailsData?.totalExpense || 0).toLocaleString()}
                      </p>
                    </div>

                    <div className="p-4 bg-indigo-500/10 rounded-xl">
                      <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase">
                        <Coins size={14} /> Net Balance
                      </div>
                      <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                        ₹{(userDetailsData?.currentBalance || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-2 text-xs">
                        <Target size={14} className="text-purple-500" /> Savings Goals
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {userDetailsData?.savingsGoalCount || 0}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl flex justify-between items-center">
                      <span className="text-slate-400 flex items-center gap-2 text-xs">
                        <CalendarDays size={14} className="text-purple-500" /> Active Habits
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {userDetailsData?.habitCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Activity Summary */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600">
                    Activity Telemetry
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Total Financial Transactions</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {userDetailsData?.transactionCount || 0}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Submitted Feedback Logs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {userDetailsData?.feedbackCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Close Details
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
