'use client';

import { useState, useEffect } from 'react';
import { Search, Plus,Edit } from 'lucide-react';
import { Button, Input, Card, Avatar, Badge, Modal, Notification } from '@/components/ui';
import { formatETH, formatDate } from '@/lib/utils';

interface User {
  _id: string;
  email: string;
  username: string;
  name: string;
  role: 'user' | 'admin';
  walletBalance: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAmount, setBalanceAmount] = useState('');
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

  useEffect(() => {
    fetchUsers();
  }, [search]);

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
                      <Avatar fallback={user.name} size="sm" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-foreground-muted">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'admin' ? 'primary' : 'default'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-accent-primary">
                      {formatETH(user.walletBalance)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
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

      {/* Edit Balance Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => {
          setSelectedUser(null);
          setBalanceAmount('');
        }}
        title="Update User Balance"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border p-4">
              <Avatar fallback={selectedUser.name} size="md" />
              <div>
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-foreground-muted">
                  @{selectedUser.username}
                </p>
                <p className="text-sm text-accent-primary">
                  Current: {formatETH(selectedUser.walletBalance)}
                </p>
              </div>
            </div>

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
              <Button
                className="flex-1"
                onClick={() => updateUserBalance('set')}
              >
                Set Balance
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