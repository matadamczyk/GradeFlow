import { Component, computed, signal } from '@angular/core';
import { NavbarItem, navbarItems } from './utils';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { SignInComponent } from '../../../layouts/auth-layout/sign-in/sign-in.component';
import { ThemeService } from '../../../core/services';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MenubarModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SignInComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  role = signal<string>('student');
  items = signal<NavbarItem[]>(
    navbarItems[this.role() as keyof typeof navbarItems]
  );

  displayDialog = signal<boolean>(false);

  loggedIn = signal<boolean>(false);
  isDarkMode = computed(() => this.themeService.isDarkMode());

  constructor(public themeService: ThemeService) {}

  logout() {
    this.loggedIn.set(false);
  }

  login() {
    
    this.displayDialog.set(true);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
