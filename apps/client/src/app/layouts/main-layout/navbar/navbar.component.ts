import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { NavbarItem, navbarItems } from './utils';
import { fromEvent, throttleTime } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { SignInComponent } from '../../../layouts/auth-layout/sign-in/sign-in.component';
import { ThemeService } from '../../../core/services';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class NavbarComponent implements OnInit {
  role = signal<string>('notLoggedIn');
  items = signal<NavbarItem[]>(
    navbarItems[this.role() as keyof typeof navbarItems]
  );

  private destroyRef = inject(DestroyRef);
  private windowWidth = signal<number>(window.innerWidth);

  isMobile = computed(() => {
    return this.windowWidth() < 960;
  });

  ngOnInit() {
    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(this.destroyRef), 
        throttleTime(100))
      .subscribe(() => {
        this.windowWidth.set(window.innerWidth);
      });
  }

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
