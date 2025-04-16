import { Component, signal } from '@angular/core';
import { NavbarItem, navbarItems } from './utils';

import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, MenubarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  role = signal<string>('student');
  items = signal<NavbarItem[]>(
    navbarItems[this.role() as keyof typeof navbarItems]
  );
}
