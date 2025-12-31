'use client';

import { useState } from 'react';
import { Mail, MessageSquare, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button, Input, Textarea, Select, Card, Notification } from '@/components/ui';
import { contactSchema, type ContactInput } from '@/lib/validations';

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
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
      title: 'Message Sent!',
      message: 'We\'ll get back to you within 24-48 hours.',
    });
  };

  if (isSubmitted) {
    return (
      <div className="py-20">
        <div className="section-container max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Message Sent Successfully!</h1>
          <p className="mt-4 text-foreground-muted">
            Thank you for reaching out. Our team will review your message and get
            back to you within 24-48 hours.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
          >
            Send Another Message
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
          <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="mt-4 text-lg text-foreground-muted">
            Have a question or need help? We&apos;re here for you.
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
                  <h3 className="font-semibold">Email</h3>
                  <p className="mt-1 text-foreground-muted">foundationexclusivenft@gmail.com</p>
                  <p className="text-sm text-foreground-subtle">
                    For general inquiries
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
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="mt-1 text-foreground-muted">Available 24/7</p>
                  <p className="text-sm text-foreground-subtle">
                    Quick response time
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
                  <h3 className="font-semibold">Response Time</h3>
                  <p className="mt-1 text-foreground-muted">Within 24-48 hours</p>
                  <p className="text-sm text-foreground-subtle">
                    Business days
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
                  <h3 className="font-semibold">Office</h3>
                  <p className="mt-1 text-foreground-muted">
                    123 Blockchain Street
                    <br />
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="you@example.com"
                  />
                </div>

                <Select
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  options={subjectOptions}
                  placeholder="Select a topic"
                />

                <Textarea
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="How can we help you?"
                  className="min-h-[150px]"
                />

                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  isLoading={isLoading}
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send Message
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
