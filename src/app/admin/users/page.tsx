'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Shield, ShieldOff } from 'lucide-react';
import { Button, Input, Card, Avatar, Badge, Modal, Notification } from '@/components/ui';
import { formatETH, formatDate } from '@/lib/utils';

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  avatar: string;
  role: 'user' | 'admin';
  walletBalance: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceOperation, setBalanceOperation] = useState<'add' | 'set'>('add');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
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
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateBalance = async () => {
    if (!selectedUser || !balanceAmount) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser._id,
          walletBalance: {
            operation: balanceOperation,
            amount: parseFloat(balanceAmount),
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Balance Updated',
          message: `New balance: ${formatETH(data.data.user.walletBalance)}`,
        });
        setShowEditModal(false);
        setSelectedUser(null);
        setBalanceAmount('');
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

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const confirmMessage = newRole === 'admin' 
      ? `Promote ${user.name} to admin?`
      : `Remove admin privileges from ${user.name}?`;
    
    if (!confirm(confirmMessage)) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          role: newRole,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotification({
          type: 'success',
          title: 'Role Updated',
          message: `${user.name} is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`,
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="mt-2 text-foreground-muted">
          Manage users and their account balances
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
            <thead>
              <tr className="border-b border-border bg-background-hover">
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                  Balance
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-foreground-muted">
                  Joined
                </th>
                <th className="px-6 py-4 text-right text-sm font-medium text-foreground-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-background-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        fallback={user.name}
                        size="sm"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-foreground-muted">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground-muted">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {formatETH(user.walletBalance)}
                  </td>
                  <td className="px-6 py-4 text-foreground-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        leftIcon={<Edit2 className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRole(user)}
                        leftIcon={
                          user.role === 'admin' ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
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
          <div className="py-12 text-center text-foreground-muted">
            No users found
          </div>
        )}
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
          setBalanceAmount('');
        }}
        title="Edit User Balance"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-xl border border-border p-4">
              <Avatar
                src={selectedUser.avatar}
                alt={selectedUser.name}
                fallback={selectedUser.name}
              />
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-foreground-muted">
                  Current balance: {formatETH(selectedUser.walletBalance)}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Operation</label>
              <div className="flex gap-2">
                <Button
                  variant={balanceOperation === 'add' ? 'primary' : 'secondary'}
                  onClick={() => setBalanceOperation('add')}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="flex-1"
                >
                  Add to Balance
                </Button>
                <Button
                  variant={balanceOperation === 'set' ? 'primary' : 'secondary'}
                  onClick={() => setBalanceOperation('set')}
                  className="flex-1"
                >
                  Set Balance
                </Button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Amount (ETH)
              </label>
              <Input
                type="number"
                value={balanceAmount}
                onChange={(e) => setBalanceAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                  setBalanceAmount('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={updateBalance}
                disabled={!balanceAmount}
              >
                Update Balance
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