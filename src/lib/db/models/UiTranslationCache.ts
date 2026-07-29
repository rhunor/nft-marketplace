import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';

// Cached, DeepL-generated message bundles for "long tail" locales that don't
// have hand-authored files under /messages. Regenerated when the `en`
// source namespace changes (tracked via contentHash).
interface IUiTranslationCacheSchema {
  locale: string;
  namespace: string;
  contentHash: string;
  messages: Record<string, unknown>;
  generatedAt: Date;
}

type UiTranslationCacheModel = Model<IUiTranslationCacheSchema>;

const UiTranslationCacheSchema = new Schema<IUiTranslationCacheSchema>({
  locale: { type: String, required: true },
  namespace: { type: String, required: true },
  contentHash: { type: String, required: true },
  messages: { type: Schema.Types.Mixed, required: true },
  generatedAt: { type: Date, default: Date.now },
});

UiTranslationCacheSchema.index({ locale: 1, namespace: 1 }, { unique: true });

const UiTranslationCache =
  (mongoose.models.UiTranslationCache as UiTranslationCacheModel) ||
  mongoose.model<IUiTranslationCacheSchema>(
    'UiTranslationCache',
    UiTranslationCacheSchema
  );

export default UiTranslationCache;
