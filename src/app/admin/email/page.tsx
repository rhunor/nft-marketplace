'use client';

import { useState, useEffect } from 'react';
import { Send, Users as UsersIcon } from 'lucide-react';
import { Button, Input, Textarea, Card, Notification } from '@/components/ui';

type Audience = 'all' | 'user' | 'admin';

export default function AdminEmailPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<Audience>('all');
  const [counts, setCounts] = useState<{ all: number; admins: number; users: number } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/email')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCounts(data.data);
      })
      .catch(() => {});
  }, []);

  const recipientCount =
    audience === 'admin' ? counts?.admins : audience === 'user' ? counts?.users : counts?.all;

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    const confirmed = window.confirm(
      `Send this email to ${recipientCount ?? 'all matching'} recipient(s)? This cannot be undone.`
    );
    if (!confirmed) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, audience }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Send failed');

      setNotification({
        type: 'success',
        title: 'Email sent',
        message: `Delivered to ${data.data.sent}/${data.data.totalRecipients} recipients${
          data.data.failed ? ` (${data.data.failed} failed)` : ''
        }`,
      });
      setSubject('');
      setMessage('');
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Failed to send email',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Mass Email</h1>
        <p className="mt-2 text-foreground-muted">
          Compose and send a branded email to your users via Resend.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Audience</h2>
          <p className="mb-4 text-sm text-foreground-muted">Choose who receives this email.</p>
          <div className="flex flex-wrap gap-2">
            {([
              ['all', 'All Users', counts?.all],
              ['user', 'Regular Users', counts?.users],
              ['admin', 'Admins', counts?.admins],
            ] as [Audience, string, number | undefined][]).map(([value, label, count]) => (
              <Button
                key={value}
                type="button"
                variant={audience === value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setAudience(value)}
                leftIcon={<UsersIcon className="h-4 w-4" />}
              >
                {label}
                {count !== undefined ? ` (${count})` : ''}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Compose</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            The message is wrapped in the Foundation Exclusive email template automatically.
          </p>
          <div className="space-y-4">
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="An update from Foundation Exclusive"
            />
            <Textarea
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here. Each line becomes its own paragraph."
              rows={10}
            />
          </div>
        </Card>

        <Button
          onClick={handleSend}
          disabled={isSending || !subject.trim() || !message.trim()}
          leftIcon={<Send className="h-4 w-4" />}
        >
          {isSending ? 'Sending...' : `Send to ${recipientCount ?? '...'} recipient(s)`}
        </Button>
      </div>

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
