// Services
import {
  AccountService,
  PasswordChangeRequest,
  ProfileUpdateRequest,
  UserProfile,
} from '../../core/services/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
// PrimeNG Services
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { UserRole } from '../../core/models/enums';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    FloatLabelModule,
    PasswordModule,
    AvatarModule,
    BadgeModule,
    TagModule,
    DividerModule,
    SkeletonModule,
    TooltipModule,
    ToastModule,
    ProgressBarModule,
    TabViewModule,
    PanelModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  providers: [MessageService],
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userProfile: UserProfile | null = null;
  isLoading = true;
  isUpdatingProfile = false;
  isChangingPassword = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  UserRole = UserRole;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-()]{9,15}$/)]],
      address: [''],
      bio: ['', [Validators.maxLength(500)]],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;

    // Ładuj profil użytkownika
    this.accountService
      .getUserProfile()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (profile) => {
          this.userProfile = profile;
          this.populateProfileForm(profile);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się załadować profilu użytkownika',
          });
        },
      });
  }

  private populateProfileForm(profile: UserProfile): void {
    this.profileForm.patchValue({
      name: profile.name || '',
      lastname: profile.lastname || '',
      phone: profile.phone || '',
      address: profile.address || '',
      bio: profile.bio || '',
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      const updateData: ProfileUpdateRequest = this.profileForm.value;

      this.accountService
        .updateProfile(updateData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isUpdatingProfile = false))
        )
        .subscribe({
          next: (updatedProfile) => {
            this.userProfile = updatedProfile;
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Profil został zaktualizowany',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zaktualizować profilu',
            });
          },
        });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      const passwordData: PasswordChangeRequest = this.passwordForm.value;

      this.accountService
        .changePassword(passwordData)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isChangingPassword = false))
        )
        .subscribe({
          next: () => {
            this.passwordForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Hasło zostało zmienione',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zmienić hasła',
            });
          },
        });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  onRefreshData(): void {
    this.loadData();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return 'To pole jest wymagane';
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} znaków`;
      if (field.errors['maxlength'])
        return `Maksimum ${field.errors['maxlength'].requiredLength} znaków`;
      if (field.errors['pattern']) return 'Nieprawidłowy format';
    }
    return '';
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'role-admin';
      case UserRole.TEACHER:
        return 'role-teacher';
      case UserRole.STUDENT:
        return 'role-student';
      case UserRole.PARENT:
        return 'role-parent';
      default:
        return 'role-default';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'Administrator';
      case UserRole.TEACHER:
        return 'Nauczyciel';
      case UserRole.STUDENT:
        return 'Uczeń';
      case UserRole.PARENT:
        return 'Rodzic';
      default:
        return 'Nieznany';
    }
  }

  getRoleIcon(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'pi pi-cog';
      case UserRole.TEACHER:
        return 'pi pi-book';
      case UserRole.STUDENT:
        return 'pi pi-graduation-cap';
      case UserRole.PARENT:
        return 'pi pi-users';
      default:
        return 'pi pi-user';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  formatDateOnly(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  // Track functions for performance optimization
  trackBySubject(index: number, item: string): string {
    return item;
  }

  trackByChild(index: number, item: string): string {
    return item;
  }
}
