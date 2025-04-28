import { BehaviorSubject, Observable, map } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme-mode';
  private themeSubject = new BehaviorSubject<ThemeMode>(this.getInitialTheme());

  public readonly theme$: Observable<ThemeMode> =
    this.themeSubject.asObservable();
  public readonly isDarkMode$: Observable<boolean> = this.theme$.pipe(
    map((theme) => theme === 'dark')
  );

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.applyTheme(this.themeSubject.value);
  }

  private getInitialTheme(): ThemeMode {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }

    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  public toggleTheme(): void {
    const newTheme: ThemeMode =
      this.themeSubject.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  public setTheme(theme: ThemeMode): void {
    localStorage.setItem(this.THEME_KEY, theme);
    this.themeSubject.next(theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: ThemeMode): void {
    if (theme === 'dark') {
      this.document.body.classList.add('dark-theme');
      this.document.body.classList.remove('light-theme');
      this.document.documentElement.classList.add('my-app-dark');
    } else {
      this.document.body.classList.add('light-theme');
      this.document.body.classList.remove('dark-theme');
      this.document.documentElement.classList.remove('my-app-dark');
    }
  }

  public isDarkMode(): boolean {
    return this.themeSubject.value === 'dark';
  }
}
