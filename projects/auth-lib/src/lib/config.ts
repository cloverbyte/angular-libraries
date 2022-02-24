import { InjectionToken } from '@angular/core';

export const CONFIG = new InjectionToken<LibraryConfig>('config');

export interface LibraryConfig {
  apiUrl?: string;
  loginNavigationPath: string;
  logoutNavigationPath: string;
}
