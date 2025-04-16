import { Component, signal } from '@angular/core';
import { NavbarItem, navbarItems } from './utils';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MenubarModule, ButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  role = signal<string>('student');
  items = signal<NavbarItem[]>(
    navbarItems[this.role() as keyof typeof navbarItems]
  );

  loggedIn = signal<boolean>(false);
  isDarkMode = signal<boolean>(false);
  logout() {
    this.loggedIn.set(false);
  }

  login() {
    this.loggedIn.set(true);
  }

  toggleDarkMode() {
    this.isDarkMode.set(!this.isDarkMode());
  }
}
