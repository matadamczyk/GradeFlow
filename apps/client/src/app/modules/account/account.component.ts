// Services
import {
  AccountService,
  PasswordChangeRequest,
  ProfileUpdateRequest,
  UserProfile,
} from '../../core/services/account.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
// PrimeNG Services
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProgressBarModule } from 'primeng/progressbar';
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
    ConfirmDialogModule,
    ToastModule,
    FileUploadModule,
    ProgressBarModule,
    TabViewModule,
    PanelModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  providers: [ConfirmationService, MessageService],
})
export class AccountComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  userProfile: UserProfile | null = null;
  statistics: any = null;
  isLoading = true;
  isUpdatingProfile = false;
  isChangingPassword = false;
  isUploadingAvatar = false;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  UserRole = UserRole;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
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

    // Ładuj statystyki
    this.accountService
      .getAccountStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.statistics = stats;
        },
        error: (error) => {
          console.error('Błąd ładowania statystyk:', error);
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
              detail: error.message || 'Nie udało się zmienić hasła',
            });
          },
        });
    } else {
      this.markFormGroupTouched(this.passwordForm);
    }
  }

  onAvatarUpload(event: any): void {
    const file = event.files[0];
    if (file) {
      this.isUploadingAvatar = true;

      this.accountService
        .uploadAvatar(file)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => (this.isUploadingAvatar = false))
        )
        .subscribe({
          next: (avatarUrl) => {
            if (this.userProfile) {
              this.userProfile.avatar = avatarUrl;
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Avatar został zaktualizowany',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zaktualizować avatara',
            });
          },
        });
    }
  }

  onDeleteAccount(): void {
    this.confirmationService.confirm({
      message:
        'Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.',
      header: 'Potwierdzenie usunięcia konta',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Usuń konto',
      rejectLabel: 'Anuluj',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.accountService
          .deleteAccount()
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sukces',
                detail: 'Konto zostało usunięte',
              });
              this.authService.logout();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Błąd',
                detail: 'Nie udało się usunąć konta',
              });
            },
          });
      },
    });
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
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} jest wymagane`;
      if (field.errors['minlength']) return `${fieldName} jest za krótkie`;
      if (field.errors['maxlength']) return `${fieldName} jest za długie`;
      if (field.errors['pattern'])
        return `${fieldName} ma nieprawidłowy format`;
      if (field.errors['passwordMismatch']) return 'Hasła nie są identyczne';
    }
    return '';
  }

  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.STUDENT:
        return 'p-badge-info';
      case UserRole.TEACHER:
        return 'p-badge-success';
      case UserRole.PARENT:
        return 'p-badge-warning';
      case UserRole.ADMIN:
        return 'p-badge-danger';
      default:
        return 'p-badge-secondary';
    }
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.STUDENT:
        return 'Uczeń';
      case UserRole.TEACHER:
        return 'Nauczyciel';
      case UserRole.PARENT:
        return 'Rodzic';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'Nieznana rola';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatDateOnly(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
