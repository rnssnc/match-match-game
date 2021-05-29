import { DEFAULT_GAME_SETTINGS, TGameSettings } from './DefaultGameSettingsContants';

export default class GameSettings {
  settings: Record<string, unknown>;

  constructor() {
    this.settings = {};

    Object.keys(DEFAULT_GAME_SETTINGS).forEach((key) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(
          key,
          JSON.stringify(DEFAULT_GAME_SETTINGS[key as keyof TGameSettings]),
        );

        this.settings[key] = DEFAULT_GAME_SETTINGS[key as keyof TGameSettings];
      } else {
        const item = localStorage.getItem(key);

        if (item) this.settings[key] = JSON.parse(item);
      }
    });
  }

  setSetting(key: keyof TGameSettings, value: any): void {
    localStorage.setItem(key, value);

    this.settings[key] = value;
  }

  getSetting(key: keyof TGameSettings): any {
    return this.settings[key];
  }
}
