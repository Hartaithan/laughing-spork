import { SettingsValues } from "@/models/settings";

type SettingsData = Record<string, SettingsValues>;

export class Settings {
  private static instance: Settings;
  private static readonly STORAGE_KEY = "laughing-spork-settings";
  public values: SettingsValues = this.getDefaultValues();

  public static getInstance(): Settings {
    if (!Settings.instance) Settings.instance = new Settings();
    return Settings.instance;
  }

  public getDefaultValues(): SettingsValues {
    return { api_key: "", experience: "" };
  }

  public async loadValues(): Promise<void> {
    try {
      const result = await chrome.storage.local.get<SettingsData>(
        Settings.STORAGE_KEY,
      );
      this.values = result?.[Settings.STORAGE_KEY] || this.getDefaultValues();
      console.log("settings values loaded");
    } catch (error) {
      this.values = this.getDefaultValues();
      console.log("unable to load settings values");
    }
  }

  public getValues(): SettingsValues {
    return this.values;
  }

  public getValue<K extends keyof SettingsValues>(key: K): SettingsValues[K] {
    return this.values[key];
  }

  public async save(values: SettingsValues): Promise<void> {
    this.values = values;
    await chrome.storage.local.set({ [Settings.STORAGE_KEY]: values });
  }
}
