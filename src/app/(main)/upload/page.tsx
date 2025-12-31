'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Music,
  FileQuestion,
  AlertCircle,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Card, Notification } from '@/components/ui';
import { nftSchema, type NFTInput } from '@/lib/validations';
import { NFT_CATEGORIES, formatETH, getMediaType, formatFileSize } from '@/lib/utils';
import { useEthPrice } from '@/contexts';

const categoryOptions = NFT_CATEGORIES.map((cat) => ({
  value: cat.value,
  label: cat.label,
  icon: cat.icon,
}));

const ACCEPTED_FILE_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

const ALL_ACCEPTED_TYPES = [
  ...ACCEPTED_FILE_TYPES.image,
  ...ACCEPTED_FILE_TYPES.video,
  ...ACCEPTED_FILE_TYPES.audio,
];

export default function UploadPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { ethPrice, formatEthToUsd } = useEthPrice();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<NFTInput>({
    title: '',
    description: '',
    price: 0.1,
    category: 'digital-art',
    tags: [],
  });
  const [priceInput, setPriceInput] = useState('0.1'); // Separate state for price input string
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof NFTInput, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message?: string;
  } | null>(null);

  // Calculate upload fee based on live ETH price ($200 worth of ETH)
  const uploadFee = 200 / ethPrice;
  const hasInsufficientBalance = (session?.user.walletBalance || 0) < uploadFee;

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!ALL_ACCEPTED_TYPES.includes(selectedFile.type)) {
      setNotification({
        type: 'error',
        title: 'Invalid file type',
        message: 'Please upload an image, video, or audio file.',
      });
      return;
    }

    // Validate file size (100MB max)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setNotification({
        type: 'error',
        title: 'File too large',
        message: 'Maximum file size is 100MB.',
      });
      return;
    }

    setFile(selectedFile);

    // Create preview for images and videos
    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        const input = document.createElement('input');
        input.type = 'file';
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFile);
        input.files = dataTransfer.files;
        handleFileChange({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [handleFileChange]
  );

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle price input separately for better UX
    if (name === 'price') {
      // Allow empty string or valid number input
      setPriceInput(value);
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        price: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Handle price input blur to format properly
  const handlePriceBlur = () => {
    const numValue = parseFloat(priceInput);
    if (isNaN(numValue) || numValue <= 0) {
      setPriceInput('');
      setFormData((prev) => ({ ...prev, price: 0 }));
    } else {
      // Format to remove unnecessary trailing zeros but keep precision
      setPriceInput(numValue.toString());
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setNotification({
        type: 'error',
        title: 'No file selected',
        message: 'Please upload an image, video, or audio file.',
      });
      return;
    }

    if (hasInsufficientBalance) {
      setNotification({
        type: 'warning',
        title: 'Insufficient Balance',
        message: `You need at least ${formatETH(uploadFee)} to upload an NFT. Please fund your account.`,
      });
      return;
    }

    // Validate price is a positive number
    if (!formData.price || formData.price <= 0) {
      setErrors((prev) => ({ ...prev, price: 'Price must be greater than 0' }));
      return;
    }

    // Validate form
    const result = nftSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof NFTInput, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof NFTInput] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('price', formData.price.toString());
      uploadData.append('category', formData.category);
      uploadData.append('tags', JSON.stringify(formData.tags));

      const response = await fetch('/api/nfts', {
        method: 'POST',
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload NFT');
      }

      // Update session with new balance
      await updateSession({
        walletBalance: session!.user.walletBalance - uploadFee,
      });

      setNotification({
        type: 'success',
        title: 'NFT Created Successfully!',
        message: 'Your NFT has been minted and is now available on the marketplace.',
      });

      // Redirect to the new NFT page
      setTimeout(() => {
        router.push(`/nft/${data.data._id}`);
      }, 2000);
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMediaIcon = () => {
    if (!file) return FileQuestion;
    const type = getMediaType(file.name);
    switch (type) {
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return ImageIcon;
    }
  };

  const MediaIcon = getMediaIcon();

  return (
    <div className="py-8">
      <div className="section-container max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create NFT</h1>
          <p className="mt-2 text-foreground-muted">
            Upload your digital artwork and mint it as an NFT
          </p>
        </div>

        {/* Balance Warning */}
        {hasInsufficientBalance && (
          <Card className="mb-6 border-warning/50 bg-warning/10 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-warning">Insufficient Balance</p>
                <p className="mt-1 text-sm text-foreground-muted">
                  You need at least {formatETH(uploadFee)} ({formatEthToUsd(uploadFee)}) to create an NFT.
                  Your current balance is {formatETH(session?.user.walletBalance || 0)}.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  onClick={() => router.push('/fund')}
                >
                  Fund Account
                </Button>
              </div>
            </div>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Upload File</h2>
            {!file ? (
              <div
                className="relative cursor-pointer rounded-xl border-2 border-dashed border-border bg-background-secondary p-12 text-center transition-colors hover:border-accent-primary"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  type="file"
                  accept={ALL_ACCEPTED_TYPES.join(',')}
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <Upload className="mx-auto h-12 w-12 text-foreground-subtle" />
                <p className="mt-4 text-lg font-medium">
                  Drag and drop or click to upload
                </p>
                <p className="mt-2 text-sm text-foreground-muted">
                  Supported: JPG, PNG, GIF, WEBP, MP4, WEBM, MP3, WAV (Max 100MB)
                </p>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute -right-2 -top-2 z-10 rounded-full bg-error p-1 text-white transition-colors hover:bg-error-muted"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-4 rounded-xl border border-border bg-background-secondary p-4">
                  {preview ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-lg">
                      {file.type.startsWith('video/') ? (
                        <video
                          src={preview}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-background-hover">
                      <MediaIcon className="h-12 w-12 text-foreground-subtle" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-foreground-muted">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-sm capitalize text-foreground-subtle">
                      {getMediaType(file.name)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* NFT Details */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">NFT Details</h2>
            <div className="space-y-5">
              <Input
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                placeholder="Enter NFT title"
                maxLength={100}
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={errors.description}
                placeholder="Describe your NFT..."
                maxLength={2000}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Price (ETH)"
                  name="price"
                  type="number"
                  step="any"
                  min="0"
                  value={priceInput}
                  onChange={handleInputChange}
                  onBlur={handlePriceBlur}
                  error={errors.price}
                  placeholder="0.1"
                />

                <Select
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  error={errors.category}
                  options={categoryOptions}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground-muted">
                  Tags (up to 10)
                </label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded-full bg-accent-primary/20 px-3 py-1 text-sm text-accent-secondary"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-error"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Fee Summary */}
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Fee Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground-muted">Upload Fee</span>
                <span className="font-medium">{formatETH(uploadFee)} ({formatEthToUsd(uploadFee)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">Your Balance</span>
                <span className="font-medium">
                  {formatETH(session?.user.walletBalance || 0)} ({formatEthToUsd(session?.user.walletBalance || 0)})
                </span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Remaining After Upload</span>
                  <span
                    className={`font-bold ${
                      hasInsufficientBalance ? 'text-error' : 'text-success'
                    }`}
                  >
                    {formatETH(
                      Math.max(0, (session?.user.walletBalance || 0) - uploadFee)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!file || hasInsufficientBalance}
            >
              Create NFT
            </Button>
          </div>
        </form>
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