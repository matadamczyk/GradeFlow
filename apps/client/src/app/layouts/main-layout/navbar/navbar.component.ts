import { Component, computed, effect, signal } from '@angular/core';
import { NavbarItem, navbarItems } from './utils';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { ThemeService } from '../../../core/services';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, ButtonModule, TooltipModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  role = signal<string>('student');
  items = signal<NavbarItem[]>(
    navbarItems[this.role() as keyof typeof navbarItems]
  );

  loggedIn = signal<boolean>(false);
  isDarkMode = computed(() => this.themeService.isDarkMode());

  constructor(public themeService: ThemeService) {}

  logout() {
    this.loggedIn.set(false);
  }

  login() {
    this.loggedIn.set(true);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
