import { SettingsValues } from "@/models/settings";

type SettingsData = Record<string, SettingsValues>;

export class Settings {
  private static instance: Settings;
  private static readonly STORAGE_KEY = "laughing-spork-settings";

  private constructor() {}

  public static getInstance(): Settings {
    if (!Settings.instance) Settings.instance = new Settings();
    return Settings.instance;
  }

  public getDefaultValues(): SettingsValues {
    return { api_key: "", experience: "" };
  }

  public async getValues(): Promise<SettingsValues> {
    try {
      const result = await chrome.storage.local.get<SettingsData>(
        Settings.STORAGE_KEY,
      );
      return result?.[Settings.STORAGE_KEY] || this.getDefaultValues();
    } catch (error) {
      return this.getDefaultValues();
    }
  }

  public async save(values: SettingsValues): Promise<void> {
    await chrome.storage.local.set({ [Settings.STORAGE_KEY]: values });
  }
}
