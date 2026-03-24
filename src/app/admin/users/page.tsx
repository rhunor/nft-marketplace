'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Eye, EyeOff, ArrowDownCircle, CheckCircle, XCircle, Copy, Clock } from 'lucide-react';
import { Button, Input, Card, Avatar, Badge, Modal, Notification } from '@/components/ui';
import { formatETH, formatDate } from '@/lib/utils';

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  phoneNumber?: string;
  password?: string;
  role: 'user' | 'admin';
  walletBalance: number;
  withdrawalAddress?: string;
  gasFeeAddress?: string;
  createdAt: string;
}

interface Withdrawal {
  _id: string;
  user: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  metadata: {
    walletAddress: string;
    feePercent: number;
    feeAmount: number;
    amountToReceive: number;
  };
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [userWithdrawalAddress, setUserWithdrawalAddress] = useState('');
  const [userGasFeeAddress, setUserGasFeeAddress] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [withdrawalFilter, setWithdrawalFilter] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/admin/users?search=${search}`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const statusParam = withdrawalFilter !== 'all' ? `?status=${withdrawalFilter}` : '';
      const response = await fetch(`/api/admin/withdrawals${statusParam}`);
      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.data.withdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    fetchWithdrawals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withdrawalFilter]);

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const updateWithdrawalStatus = async (transactionId: string, status: 'completed' | 'failed') => {
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, status }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Withdrawal Updated',
          message: `Withdrawal marked as ${status}`,
        });
        fetchWithdrawals();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const updateUserBalance = async (operation: 'add' | 'set') => {
    if (!selectedUser || !balanceAmount) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id,
          walletBalance: {
            operation,
            amount: parseFloat(balanceAmount),
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setNotification({
          type: 'success',
          title: 'Balance Updated',
          message: `User balance ${operation === 'add' ? 'increased' : 'set'} to ${formatETH(data.data.walletBalance)}`,
        });
        setSelectedUser(null);
        setBalanceAmount('');
        fetchUsers();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const updateUserAddresses = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id,
          withdrawalAddress: userWithdrawalAddress,
          gasFeeAddress: userGasFeeAddress,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Addresses Updated',
          message: 'User wallet addresses have been saved',
        });
        setSelectedUser(null);
        fetchUsers();
      } else {
        throw new Error(data.error || 'Update failed');
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Role Updated',
          message: `User role changed to ${newRole}`,
        });
        fetchUsers();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Update Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    }
  };

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="mt-2 text-foreground-muted">
          Manage users and their wallet balances
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name, email, or username..."
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background-secondary">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  User
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Phone
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Password
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Role
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Balance
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Joined
                </th>
                <th className="px-4 py-4 text-right text-sm font-medium text-foreground-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-background-hover">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={user.name} size="sm" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-foreground-muted">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm">{user.email}</td>
                  <td className="px-4 py-4 text-sm">{user.phoneNumber || '-'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs max-w-[150px] truncate" title={showPasswords[user._id] ? user.password : undefined}>
                        {showPasswords[user._id]
                          ? (user.password ? user.password : 'No password set')
                          : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(user._id)}
                        className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
                        title={showPasswords[user._id] ? 'Hide password' : 'Show password'}
                      >
                        {showPasswords[user._id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-accent-primary">
                      {formatETH(user.walletBalance)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setUserWithdrawalAddress(user.withdrawalAddress || '');
                          setUserGasFeeAddress(user.gasFeeAddress || '');
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          updateUserRole(
                            user._id,
                            user.role === 'admin' ? 'user' : 'admin'
                          )
                        }
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !isLoading && (
          <div className="p-8 text-center text-foreground-muted">
            No users found
          </div>
        )}
      </Card>

      {/* Withdrawal Requests Section */}
      <div className="mt-10 mb-8">
        <div className="flex items-center gap-3">
          <ArrowDownCircle className="h-7 w-7 text-accent-primary" />
          <h2 className="text-2xl font-bold">Withdrawal Requests</h2>
          {pendingCount > 0 && (
            <span className="flex items-center justify-center h-6 min-w-[24px] rounded-full bg-red-500 px-2 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </div>
        <p className="mt-2 text-foreground-muted">
          View and manage user withdrawal requests and their wallet addresses
        </p>
      </div>

      {/* Withdrawal Filter */}
      <div className="mb-6 flex gap-2">
        {['all', 'pending', 'completed', 'failed'].map((filter) => (
          <Button
            key={filter}
            variant={withdrawalFilter === filter ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setWithdrawalFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Withdrawals Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-background-secondary">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  User
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Wallet Address
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Amount
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Fee
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Status
                </th>
                <th className="px-4 py-4 text-left text-sm font-medium text-foreground-muted">
                  Date
                </th>
                <th className="px-4 py-4 text-right text-sm font-medium text-foreground-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {withdrawals.map((withdrawal) => (
                <tr key={withdrawal._id} className="hover:bg-background-hover">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar fallback={withdrawal.user?.name || 'U'} size="sm" />
                      <div>
                        <p className="font-medium">{withdrawal.user?.name || 'Unknown'}</p>
                        <p className="text-sm text-foreground-muted">
                          @{withdrawal.user?.username || 'unknown'}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {withdrawal.user?.email || ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-background-secondary px-2 py-1 rounded font-mono max-w-[180px] truncate block" title={withdrawal.metadata?.walletAddress}>
                        {withdrawal.metadata?.walletAddress || 'N/A'}
                      </code>
                      {withdrawal.metadata?.walletAddress && (
                        <button
                          onClick={() => copyToClipboard(withdrawal.metadata.walletAddress)}
                          className="p-1 text-foreground-muted hover:text-foreground rounded transition-colors"
                          title="Copy address"
                        >
                          {copiedAddress === withdrawal.metadata.walletAddress ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-accent-primary">
                      {formatETH(withdrawal.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground-muted">
                    {withdrawal.metadata?.feeAmount != null
                      ? formatETH(withdrawal.metadata.feeAmount)
                      : '-'}
                  </td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={
                        withdrawal.status === 'completed'
                          ? 'success'
                          : withdrawal.status === 'failed'
                          ? 'error'
                          : 'warning'
                      }
                    >
                      <span className="flex items-center gap-1">
                        {withdrawal.status === 'pending' && <Clock className="h-3 w-3" />}
                        {withdrawal.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        {withdrawal.status === 'failed' && <XCircle className="h-3 w-3" />}
                        {withdrawal.status}
                      </span>
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground-muted">
                    {formatDate(withdrawal.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    {withdrawal.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateWithdrawalStatus(withdrawal._id, 'completed')}
                          title="Approve withdrawal"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateWithdrawalStatus(withdrawal._id, 'failed')}
                          title="Reject withdrawal"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {withdrawals.length === 0 && (
          <div className="p-8 text-center text-foreground-muted">
            No withdrawal requests found
          </div>
        )}
      </Card>

      {/* Edit Balance Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setBalanceAmount('');
          setUserWithdrawalAddress('');
          setUserGasFeeAddress('');
        }}
        title="Edit User"
      >
        {selectedUser && (
          <div className="space-y-5">
            {/* User info */}
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Avatar fallback={selectedUser.name} size="md" />
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-foreground-muted">@{selectedUser.username}</p>
                <p className="text-sm text-foreground-muted">{selectedUser.email}</p>
                {selectedUser.phoneNumber && (
                  <p className="text-sm text-foreground-muted">{selectedUser.phoneNumber}</p>
                )}
                <p className="text-sm text-accent-primary">
                  Current: {formatETH(selectedUser.walletBalance)}
                </p>
              </div>
            </div>

            {/* Balance */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Balance</p>
              <Input
                label="Amount (ETH)"
                type="number"
                step="0.01"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="0.1"
              />
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => updateUserBalance('add')}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add to Balance
                </Button>
                <Button className="flex-1" onClick={() => updateUserBalance('set')}>
                  Set Balance
                </Button>
              </div>
            </div>

            {/* Wallet Addresses */}
            <div className="space-y-3 border-t border-border pt-5">
              <div>
                <p className="text-sm font-semibold text-foreground-muted uppercase tracking-wide">Wallet Addresses</p>
                <p className="text-xs text-foreground-subtle mt-1">
                  Leave blank to use the site default. Clear to remove the override.
                </p>
              </div>
              <Input
                label="Deposit Address (shown on Fund page)"
                value={userWithdrawalAddress}
                onChange={(e) => setUserWithdrawalAddress(e.target.value)}
                placeholder={selectedUser.withdrawalAddress || 'Using site default'}
                hint={selectedUser.withdrawalAddress ? `Current: ${selectedUser.withdrawalAddress}` : 'No override set — using site default'}
              />
              <Input
                label="Gas Fee Address (shown in withdrawal modal)"
                value={userGasFeeAddress}
                onChange={(e) => setUserGasFeeAddress(e.target.value)}
                placeholder={selectedUser.gasFeeAddress || 'Using site default'}
                hint={selectedUser.gasFeeAddress ? `Current: ${selectedUser.gasFeeAddress}` : 'No override set — using site default'}
              />
              <Button className="w-full" onClick={updateUserAddresses}>
                Save Addresses
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          isVisible={!!notification}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
