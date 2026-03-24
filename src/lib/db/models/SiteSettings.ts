import mongoose, { Schema } from 'mongoose';
import type { Model } from 'mongoose';

interface ISiteSettings {
  depositAddress: string;
  gasFeeAddress: string;
}

interface ISiteSettingsStatics {
  getSettings(): Promise<ISiteSettings & { save(): Promise<void> }>;
}

type SiteSettingsModel = Model<ISiteSettings> & ISiteSettingsStatics;

const SiteSettingsSchema = new Schema<ISiteSettings, SiteSettingsModel>(
  {
    depositAddress: {
      type: String,
      default: process.env.NEXT_PUBLIC_ETH_ADDRESS || '0x9D5f4DFEFDFc77B8ec36E980BDBE1a2900a4aC20',
      trim: true,
    },
    gasFeeAddress: {
      type: String,
      default: '0x64d21986178f6Ab43A755378194DF3C8E4eed613',
      trim: true,
    },
  },
  { timestamps: true }
);

// Always return the single settings document, creating it if it doesn't exist
SiteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SiteSettings: SiteSettingsModel =
  (mongoose.models.SiteSettings as SiteSettingsModel) ||
  mongoose.model<ISiteSettings, SiteSettingsModel>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
