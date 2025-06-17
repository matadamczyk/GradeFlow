import { AuthService, ThemeService } from '../../../core/services';
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
import { fromEvent, map, throttleTime } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { MenubarModule } from 'primeng/menubar';
import { Router } from '@angular/router';
import { SignInComponent } from '../../auth-layout/sign-in/sign-in.component';
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
export class NavbarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private windowWidth = signal<number>(window.innerWidth);

  currentUser = signal<any>(null);

  isLoggedIn = computed(() => {
    const user = this.currentUser();
    return !!user;
  });

  menuKey = computed(() => {
    const user = this.currentUser();

    if (!user) {
      return 'notLoggedIn';
    }
    return user.role || 'STUDENT';
  });

  items = computed(() => {
    const key = this.menuKey();
    return navbarItems[key as keyof typeof navbarItems];
  });

  isMobile = computed(() => {
    return this.windowWidth() < 960;
  });

  displayDialog = signal<boolean>(false);
  isDarkMode = computed(() => this.themeService.isDarkMode());

  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => {
        this.currentUser.set(user);
      });

    fromEvent(window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef), throttleTime(100))
      .subscribe(() => {
        this.windowWidth.set(window.innerWidth);
      });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  login() {
    this.displayDialog.set(true);
  }

  onLoginSuccess() {
    this.displayDialog.set(false);

    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 100);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
