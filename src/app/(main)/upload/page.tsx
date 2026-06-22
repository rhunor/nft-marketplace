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
  Plus,
  Trash2,
  Layers,
  ImagePlus,
  CheckCircle,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Card, Badge, Notification } from '@/components/ui';
import { nftSchema, type NFTInput } from '@/lib/validations';
import { NFT_CATEGORIES, formatETH, formatFileSize, safeFetch } from '@/lib/utils';
import { useEthPrice } from '@/contexts';
import type { NFTCategory } from '@/types';

type UploadMode = 'single' | 'collection';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  price: string;
  tags: string[];
  file: File | null;
  preview: string | null;
}

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

const generateId = () => `item_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;


const getMediaIcon = (type: string | undefined) => {
  if (!type) return <FileQuestion className="h-6 w-6 sm:h-8 sm:w-8" />;
  if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8" />;
  if (type.startsWith('video/')) return <Video className="h-6 w-6 sm:h-8 sm:w-8" />;
  if (type.startsWith('audio/')) return <Music className="h-6 w-6 sm:h-8 sm:w-8" />;
  return <FileQuestion className="h-6 w-6 sm:h-8 sm:w-8" />;
};

export default function UploadPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const { ethPrice, formatEthToUsd } = useEthPrice();

  // Upload mode
  const [mode, setMode] = useState<UploadMode>('single');

  // Single upload state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<NFTInput>({
    title: '',
    description: '',
    price: 0.1,
    category: 'digital-images',
    tags: [],
  });
  const [priceInput, setPriceInput] = useState('0.1');
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof NFTInput, string>>>({});

  // Collection upload state
  const [collectionName, setCollectionName] = useState('');
  const [collectionDescription, setCollectionDescription] = useState('');
  const [collectionCategory, setCollectionCategory] = useState<NFTCategory>('digital-images');
  const [collectionPrice, setCollectionPrice] = useState('0.5'); // Single price for entire collection
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>([
    { id: generateId(), title: '', description: '', price: '0.1', tags: [], file: null, preview: null },
    { id: generateId(), title: '', description: '', price: '0.1', tags: [], file: null, preview: null },
  ]);
  const [collectionErrors, setCollectionErrors] = useState<Record<string, string>>({});

  // Common state
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    title: string;
    message?: string;
  } | null>(null);

  // Calculate fees - $200 per photo for both single and collection uploads
  const pricePerPhoto = 200; // USD
  const pricePerPhotoInEth = pricePerPhoto / ethPrice;
  const singleUploadFee = pricePerPhotoInEth;
  const collectionUploadFee = pricePerPhotoInEth * collectionItems.length;
  const currentFee = mode === 'single' ? singleUploadFee : collectionUploadFee;
  const hasInsufficientBalance = (session?.user.walletBalance || 0) < currentFee;

  // Single upload handlers
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALL_ACCEPTED_TYPES.includes(selectedFile.type)) {
      setNotification({ type: 'error', title: 'Invalid file type', message: 'Please upload an image, video, or audio file.' });
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setNotification({ type: 'error', title: 'File too large', message: 'Maximum file size is 100MB.' });
      return;
    }

    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, [handleFileChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setPriceInput(value);
      setFormData((prev) => ({ ...prev, price: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePriceBlur = () => {
    const numValue = parseFloat(priceInput);
    if (isNaN(numValue) || numValue <= 0) {
      setPriceInput('');
      setFormData((prev) => ({ ...prev, price: 0 }));
    } else {
      setPriceInput(numValue.toString());
    }
  };

  const addTag = () => {
    // Strip anything that isn't a letter, digit, hyphen, or space, then collapse spaces
    const tag = tagInput.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ');
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  // Collection handlers
  const addCollectionItem = () => {
    if (collectionItems.length >= 20) {
      setNotification({ type: 'warning', title: 'Maximum reached', message: 'A collection can have at most 20 items.' });
      return;
    }
    setCollectionItems((prev) => [...prev, { id: generateId(), title: '', description: '', price: '0.1', tags: [], file: null, preview: null }]);
  };

  const removeCollectionItem = (id: string) => {
    if (collectionItems.length <= 2) {
      setNotification({ type: 'warning', title: 'Minimum required', message: 'A collection must have at least 2 items.' });
      return;
    }
    setCollectionItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCollectionItem = (id: string, field: string, value: string | string[] | File | null) => {
    setCollectionItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    setCollectionErrors((prev) => ({ ...prev, [`item_${id}_${field}`]: '' }));
  };

  const handleCollectionFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!ALL_ACCEPTED_TYPES.includes(selectedFile.type)) {
      setNotification({ type: 'error', title: 'Invalid file type' });
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setNotification({ type: 'error', title: 'File too large', message: 'Maximum 100MB.' });
      return;
    }

    updateCollectionItem(id, 'file', selectedFile);

    if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setCollectionItems((prev) => prev.map((item) => (item.id === id ? { ...item, preview: reader.result as string } : item)));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Submit handlers
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setNotification({ type: 'error', title: 'No file selected' });
      return;
    }

    if (hasInsufficientBalance) {
      setNotification({ type: 'warning', title: 'Insufficient Balance', message: `Need ${formatETH(currentFee)} to upload.` });
      return;
    }

    if (!formData.price || formData.price <= 0) {
      setErrors((prev) => ({ ...prev, price: 'Price must be greater than 0' }));
      return;
    }

    // Auto-fill description with title for validation
    const dataForValidation = {
      ...formData,
      description: formData.title || 'NFT Description',
    };

    const result = nftSchema.safeParse(dataForValidation);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof NFTInput, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] && err.path[0] !== 'description') fieldErrors[err.path[0] as keyof NFTInput] = err.message;
      });
      setErrors(fieldErrors);
      if (Object.keys(fieldErrors).length > 0) return;
    }

    setIsLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', formData.title.trim());
      uploadData.append('description', formData.title.trim());
      uploadData.append('price', formData.price.toString());
      uploadData.append('category', formData.category);
      uploadData.append('tags', JSON.stringify(formData.tags));

      const response = await fetch('/api/nfts', { method: 'POST', body: uploadData });
      const result = await safeFetch(response);

      if (!result.ok) throw new Error(result.error);

      const nftData = result.data as { data?: { nft?: { _id?: string }; newBalance?: number } };
      await updateSession({ walletBalance: nftData?.data?.newBalance });
      setNotification({ type: 'success', title: 'NFT Created!', message: 'Your NFT has been uploaded successfully.' });
      setTimeout(() => router.push(`/nft/${nftData?.data?.nft?._id}`), 1500);
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!collectionName.trim()) newErrors.collectionName = 'Required';
    if (!collectionDescription.trim()) newErrors.collectionDescription = 'Required';
    
    // Validate collection price
    const price = parseFloat(collectionPrice);
    if (isNaN(price) || price <= 0) {
      newErrors.collectionPrice = 'Collection price must be greater than 0';
    }

    let hasItemErrors = false;
    collectionItems.forEach((item) => {
      if (!item.file) { newErrors[`item_${item.id}_file`] = 'Required'; hasItemErrors = true; }
      if (!item.title.trim()) { newErrors[`item_${item.id}_title`] = 'Required'; hasItemErrors = true; }
      // Description is now optional for collection items
    });

    if (Object.keys(newErrors).length > 0) {
      setCollectionErrors(newErrors);
      if (hasItemErrors) setNotification({ type: 'error', title: 'Please fill all required fields' });
      return;
    }

    if (hasInsufficientBalance) {
      setNotification({ type: 'warning', title: 'Insufficient Balance', message: `Need ${formatETH(currentFee)} to create collection.` });
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append('name', collectionName.trim());
      formDataObj.append('description', collectionDescription.trim());
      formDataObj.append('category', collectionCategory);
      formDataObj.append('collectionPrice', collectionPrice);

      const pricePerItem = parseFloat(collectionPrice) / collectionItems.length;
      const itemsData = collectionItems.map((item) => ({
        title: item.title.trim(),
        description: item.title.trim(),
        price: pricePerItem,
        tags: item.tags,
      }));
      formDataObj.append('items', JSON.stringify(itemsData));

      collectionItems.forEach((item, index) => {
        if (item.file) formDataObj.append(`file_${index}`, item.file);
      });

      const response = await fetch('/api/collections', { method: 'POST', body: formDataObj });
      const result = await safeFetch(response);

      if (!result.ok) throw new Error(result.error);

      const colData = result.data as { data?: { collection?: { _id?: string }; uploadedCount?: number; newBalance?: number } };
      await updateSession({ walletBalance: colData?.data?.newBalance });
      setNotification({
        type: 'success',
        title: 'Collection Created!',
        message: `${colData?.data?.uploadedCount ?? collectionItems.length} items uploaded successfully.`,
      });
      setTimeout(() => router.push(`/collection/${colData?.data?.collection?._id}`), 1500);
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="py-6 sm:py-8">
      <div className="section-container max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold sm:text-4xl">Create NFT</h1>
          <p className="mt-2 text-sm sm:text-base text-foreground-muted">Upload your digital artwork</p>
        </div>

        {/* Mode Selection */}
        <div className="mb-6 sm:mb-8 grid gap-3 sm:gap-4 grid-cols-2">
          <button
            type="button"
            onClick={() => setMode('single')}
            className={`relative flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all ${
              mode === 'single' ? 'border-accent-primary bg-accent-primary/10' : 'border-border hover:border-accent-primary/50'
            }`}
          >
            <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 ${mode === 'single' ? 'bg-accent-primary/20' : 'bg-background-hover'}`}>
              <ImagePlus className={`h-5 w-5 sm:h-6 sm:w-6 ${mode === 'single' ? 'text-accent-primary' : 'text-foreground-muted'}`} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-semibold">Single NFT</h3>
              <p className="text-xs sm:text-sm text-foreground-muted hidden sm:block">Upload one artwork</p>
            </div>
            {mode === 'single' && <CheckCircle className="absolute right-2 top-2 sm:right-4 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-accent-primary" />}
          </button>

          <button
            type="button"
            onClick={() => setMode('collection')}
            className={`relative flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 transition-all ${
              mode === 'collection' ? 'border-accent-primary bg-accent-primary/10' : 'border-border hover:border-accent-primary/50'
            }`}
          >
            <div className={`rounded-lg sm:rounded-xl p-2 sm:p-3 ${mode === 'collection' ? 'bg-accent-primary/20' : 'bg-background-hover'}`}>
              <Layers className={`h-5 w-5 sm:h-6 sm:w-6 ${mode === 'collection' ? 'text-accent-primary' : 'text-foreground-muted'}`} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-semibold">Collection</h3>
              <p className="text-xs sm:text-sm text-foreground-muted hidden sm:block">2-20 items at once</p>
            </div>
            {mode === 'collection' && <CheckCircle className="absolute right-2 top-2 sm:right-4 sm:top-4 h-4 w-4 sm:h-5 sm:w-5 text-accent-primary" />}
          </button>
        </div>

        {/* Fee Card */}
        <Card className="mb-6 sm:mb-8 p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm text-foreground-muted">Upload Fee</p>
              <p className="text-lg sm:text-xl font-bold text-accent-primary">
                {formatETH(currentFee)}
                <span className="ml-2 text-xs sm:text-sm font-normal text-foreground-subtle">≈ {formatEthToUsd(currentFee)}</span>
              </p>
              <p className="text-xs text-foreground-subtle">
                {mode === 'single' 
                  ? '$200 per NFT upload'
                  : `$200 × ${collectionItems.length} items = $${(200 * collectionItems.length).toLocaleString()}`
                }
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs sm:text-sm text-foreground-muted">Your Balance</p>
              <p className={`text-base sm:text-lg font-semibold ${hasInsufficientBalance ? 'text-error' : 'text-success'}`}>
                {formatETH(session.user.walletBalance)}
              </p>
            </div>
          </div>
          {hasInsufficientBalance && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-error/10 p-2 sm:p-3 text-xs sm:text-sm text-error">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Insufficient balance. Please fund your account.</span>
            </div>
          )}
        </Card>

        {/* Single Upload Form */}
        {mode === 'single' && (
          <form onSubmit={handleSingleSubmit}>
            <Card className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {/* File Upload */}
                <div>
                  <label className="mb-2 block text-sm font-medium">Media File *</label>
                  {!file ? (
                    <label
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-xl sm:rounded-2xl border-2 border-dashed border-border bg-background-hover p-6 sm:p-8 transition-colors hover:border-accent-primary"
                    >
                      <Upload className="mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-foreground-subtle" />
                      <p className="mb-1 sm:mb-2 text-center text-sm sm:text-base font-medium">Drag and drop or click to upload</p>
                      <p className="text-center text-xs sm:text-sm text-foreground-muted">JPG, PNG, GIF, MP4, MP3 (Max 100MB)</p>
                      <input type="file" accept={ALL_ACCEPTED_TYPES.join(',')} onChange={handleFileChange} className="hidden" />
                    </label>
                  ) : (
                    <div className="relative rounded-xl border border-border bg-background-hover p-3 sm:p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {preview ? (
                          <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-lg sm:rounded-xl shrink-0">
                            {file.type.startsWith('video/') ? (
                              <video src={preview} className="h-full w-full object-cover" />
                            ) : (
                              <Image src={preview} alt="Preview" fill className="object-cover" />
                            )}
                          </div>
                        ) : (
                          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg sm:rounded-xl bg-background-secondary shrink-0">
                            {getMediaIcon(file.type)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base truncate">{file.name}</p>
                          <p className="text-xs sm:text-sm text-foreground-muted">{formatFileSize(file.size)}</p>
                        </div>
                        <button type="button" onClick={() => { setFile(null); setPreview(null); }} className="rounded-lg p-2 hover:bg-error/10 hover:text-error">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <Input label="Title *" name="title" value={formData.title} onChange={handleInputChange} error={errors.title} placeholder="NFT title" maxLength={100} />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input label="Price (ETH) *" name="price" type="number" step="any" min="0" value={priceInput} onChange={handleInputChange} onBlur={handlePriceBlur} error={errors.price} placeholder="0.1" />
                  <Select label="Category *" name="category" value={formData.category} onChange={handleInputChange} options={categoryOptions} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Tags (up to 10)</label>
                  <div className="flex gap-2">
                    <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Add tag" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                    <Button type="button" variant="secondary" onClick={addTag}>Add</Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="gap-1 pl-3">
                          {tag}
                          <button type="button" onClick={() => setFormData((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }))} className="ml-1 rounded-full p-0.5 hover:bg-background-hover">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || hasInsufficientBalance} leftIcon={isLoading ? undefined : <Upload className="h-5 w-5" />}>
                  {isLoading ? 'Uploading...' : 'Create NFT'}
                </Button>
              </div>
            </Card>
          </form>
        )}

        {/* Collection Upload Form */}
        {mode === 'collection' && (
          <form onSubmit={handleCollectionSubmit}>
            <Card className="mb-4 sm:mb-6 p-4 sm:p-6">
              <h2 className="mb-4 text-base sm:text-lg font-semibold">Collection Details</h2>
              <div className="space-y-4">
                <Input label="Collection Name *" value={collectionName} onChange={(e) => { setCollectionName(e.target.value); setCollectionErrors((p) => ({ ...p, collectionName: '' })); }} error={collectionErrors.collectionName} placeholder="My Collection" maxLength={100} />
                <Textarea label="Description *" value={collectionDescription} onChange={(e) => { setCollectionDescription(e.target.value); setCollectionErrors((p) => ({ ...p, collectionDescription: '' })); }} error={collectionErrors.collectionDescription} placeholder="Describe your collection..." maxLength={2000} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Select label="Category *" value={collectionCategory} onChange={(e) => setCollectionCategory(e.target.value as NFTCategory)} options={categoryOptions} />
                  <Input 
                    label="Collection Price (ETH) *" 
                    type="number" 
                    step="any" 
                    min="0.01" 
                    value={collectionPrice} 
                    onChange={(e) => { setCollectionPrice(e.target.value); setCollectionErrors((p) => ({ ...p, collectionPrice: '' })); }} 
                    error={collectionErrors.collectionPrice} 
                    placeholder="0.5"
                    hint={`Price per item: ${formatETH(parseFloat(collectionPrice || '0') / Math.max(collectionItems.length, 1))}`}
                  />
                </div>
              </div>
            </Card>

            <div className="mb-3 sm:mb-4 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold">Items ({collectionItems.length})</h2>
              <Button type="button" variant="secondary" size="sm" onClick={addCollectionItem} leftIcon={<Plus className="h-4 w-4" />} disabled={collectionItems.length >= 20}>
                Add
              </Button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {collectionItems.map((item, index) => (
                <Card key={item.id} className="p-3 sm:p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium">Item {index + 1}</h3>
                    <button type="button" onClick={() => removeCollectionItem(item.id)} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-error/10 hover:text-error" disabled={collectionItems.length <= 2}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* File */}
                  {!item.file ? (
                    <label className="mb-3 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border bg-background-hover p-4 transition-colors hover:border-accent-primary">
                      <div className="text-center">
                        <Upload className="mx-auto mb-2 h-6 w-6 text-foreground-subtle" />
                        <p className="text-xs sm:text-sm">Click to upload</p>
                      </div>
                      <input type="file" accept={ALL_ACCEPTED_TYPES.join(',')} onChange={(e) => handleCollectionFileChange(item.id, e)} className="hidden" />
                    </label>
                  ) : (
                    <div className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-background-hover p-2 sm:p-3">
                      {item.preview ? (
                        <div className="relative h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-lg shrink-0">
                          <Image src={item.preview} alt="Preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-lg bg-background-secondary shrink-0">
                          {getMediaIcon(item.file.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium truncate">{item.file.name}</p>
                        <p className="text-xs text-foreground-muted">{formatFileSize(item.file.size)}</p>
                      </div>
                      <button type="button" onClick={() => updateCollectionItem(item.id, 'file', null)} className="p-1.5 hover:text-error">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {collectionErrors[`item_${item.id}_file`] && <p className="mb-2 text-xs text-error">{collectionErrors[`item_${item.id}_file`]}</p>}

                  <div className="space-y-3">
                    <Input label="Title *" value={item.title} onChange={(e) => updateCollectionItem(item.id, 'title', e.target.value)} error={collectionErrors[`item_${item.id}_title`]} placeholder="Item title" maxLength={100} />
                  </div>
                </Card>
              ))}
            </div>

            <Button type="submit" className="mt-6 w-full" disabled={isLoading || hasInsufficientBalance} leftIcon={isLoading ? undefined : <Upload className="h-5 w-5" />}>
              {isLoading ? 'Creating Collection...' : `Create Collection (${collectionItems.length} items)`}
            </Button>
          </form>
        )}
      </div>

      {notification && (
        <Notification type={notification.type} title={notification.title} message={notification.message} isVisible={!!notification} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}