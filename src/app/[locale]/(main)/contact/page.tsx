'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea, Select, Card, Notification } from '@/components/ui';
import { contactSchema, type ContactInput } from '@/lib/validations';

export default function ContactPage() {
  const t = useTranslations('contact');

  const subjectOptions = [
    { value: 'general', label: t('subjectOptions.general') },
    { value: 'support', label: t('subjectOptions.support') },
    { value: 'billing', label: t('subjectOptions.billing') },
    { value: 'partnership', label: t('subjectOptions.partnership') },
    { value: 'bug', label: t('subjectOptions.bug') },
    { value: 'feature', label: t('subjectOptions.feature') },
    { value: 'other', label: t('subjectOptions.other') },
  ];

  const [formData, setFormData] = useState<ContactInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    title: string;
    message?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactInput, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof ContactInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);
    setNotification({
      type: 'success',
      title: t('notification.title'),
      message: t('notification.message'),
    });
  };

  if (isSubmitted) {
    return (
      <div className="py-20">
        <div className="section-container max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">{t('success.heading')}</h1>
          <p className="mt-4 text-foreground-muted">
            {t('success.text')}
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
          >
            {t('success.sendAnother')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="section-container">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">{t('header.heading')}</h1>
          <p className="mt-4 text-lg text-foreground-muted">
            {t('header.subtitle')}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <Mail className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('info.email.title')}</h3>
                  <p className="mt-1 text-foreground-muted">foundationexclusivenft@gmail.com</p>
                  <p className="text-sm text-foreground-subtle">
                    {t('info.email.subtitle')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <MessageSquare className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('info.liveChat.title')}</h3>
                  <p className="mt-1 text-foreground-muted">{t('info.liveChat.value')}</p>
                  <p className="text-sm text-foreground-subtle">
                    {t('info.liveChat.subtitle')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <Clock className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('info.responseTime.title')}</h3>
                  <p className="mt-1 text-foreground-muted">{t('info.responseTime.value')}</p>
                  <p className="text-sm text-foreground-subtle">
                    {t('info.responseTime.subtitle')}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-accent-primary/20 p-3">
                  <MapPin className="h-6 w-6 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('info.office.title')}</h3>
                  <p className="mt-1 text-foreground-muted">
                    {t('info.office.line1')}
                    <br />
                    {t('info.office.line2')}
                    <br />
                    {t('info.office.line3')}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold">{t('form.heading')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label={t('form.nameLabel')}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder={t('form.namePlaceholder')}
                  />
                  <Input
                    label={t('form.emailLabel')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder={t('form.emailPlaceholder')}
                  />
                </div>

                <Select
                  label={t('form.subjectLabel')}
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  options={subjectOptions}
                  placeholder={t('form.subjectPlaceholder')}
                />

                <Textarea
                  label={t('form.messageLabel')}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder={t('form.messagePlaceholder')}
                  className="min-h-[150px]"
                />

                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  isLoading={isLoading}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  {t('form.submit')}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

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
