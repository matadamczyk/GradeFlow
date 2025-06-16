// Services
import { ApiService, AuthService } from '../../core/services';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { POLISH_PRIMENG_TRANSLATION } from '../../core/config/primeng-config';
import { PrimeNG } from 'primeng/config';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { UserRole } from '../../core/models/enums';

interface User {
  id: number;
  email: string;
  password?: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  students: number;
  teachers: number;
  parents: number;
  admins: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    ProgressSpinnerModule,
    BadgeModule,
    DividerModule,
    SplitButtonModule,
    MenuModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Signals
  isLoading = signal<boolean>(true);
  users = signal<User[]>([]);
  selectedUsers = signal<User[]>([]);
  userStats = signal<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    students: 0,
    teachers: 0,
    parents: 0,
    admins: 0,
  });

  // Dialog states
  userDialogVisible = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  currentUser = signal<User | null>(null);

  // Form
  userForm!: FormGroup;

  // Dropdown options
  roleOptions = [
    { label: 'Student', value: UserRole.STUDENT },
    { label: 'Nauczyciel', value: UserRole.TEACHER },
    { label: 'Rodzic', value: UserRole.PARENT },
    { label: 'Administrator', value: UserRole.ADMIN },
  ];

  // Computed properties
  UserRole = UserRole;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private primeng: PrimeNG
  ) {
    this.initializeForm();
    this.configurePrimeNG();
  }

  ngOnInit(): void {
    // Sprawdź czy użytkownik jest zalogowany jako admin
    const currentUser = this.authService.getCurrentUser();
    console.log('Admin component - current user:', currentUser);
    console.log(
      'Admin component - is logged in:',
      this.authService.isLoggedIn()
    );
    console.log('Admin component - token:', this.authService.getToken());

    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      console.error('Unauthorized access to admin panel');
      this.messageService.add({
        severity: 'error',
        summary: 'Błąd dostępu',
        detail: 'Nie masz uprawnień do tej sekcji',
      });
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [UserRole.STUDENT, Validators.required],
    });
  }

  private configurePrimeNG(): void {
    this.primeng.setTranslation(POLISH_PRIMENG_TRANSLATION);
  }

  private loadUsers(): void {
    this.isLoading.set(true);

    forkJoin({
      users: this.apiService.getAllUsers(),
      students: this.apiService.getAllStudents(),
      teachers: this.apiService.getAllTeachers(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.users.set(data.users);
          this.calculateStats(data.users);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się załadować użytkowników',
          });
          this.isLoading.set(false);
        },
      });
  }

  private calculateStats(users: User[]): void {
    const stats: UserStats = {
      totalUsers: users.length,
      activeUsers: users.filter((u) => u.isActive !== false).length,
      students: users.filter((u) => u.role === UserRole.STUDENT).length,
      teachers: users.filter((u) => u.role === UserRole.TEACHER).length,
      parents: users.filter((u) => u.role === UserRole.PARENT).length,
      admins: users.filter((u) => u.role === UserRole.ADMIN).length,
    };

    this.userStats.set(stats);
  }

  openNewUserDialog(): void {
    this.isEditMode.set(false);
    this.currentUser.set(null);
    this.userForm.reset();
    this.userForm.patchValue({ role: UserRole.STUDENT });
    this.userDialogVisible.set(true);
  }

  openEditUserDialog(user: User): void {
    this.isEditMode.set(true);
    this.currentUser.set(user);
    this.userForm.patchValue({
      email: user.email,
      role: user.role,
    });
    // Don't show password in edit mode
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userDialogVisible.set(true);
  }

  hideDialog(): void {
    this.userDialogVisible.set(false);
    this.userForm.reset();
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;

      if (this.isEditMode()) {
        const currentUser = this.currentUser();
        if (currentUser) {
          const updateData: any = {
            email: formValue.email,
            role: formValue.role,
          };

          if (formValue.password) {
            updateData.password = formValue.password;
          }

          this.apiService
            .updateUser(currentUser.id, updateData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sukces',
                  detail: 'Użytkownik został zaktualizowany',
                });
                this.loadUsers();
                this.hideDialog();
              },
              error: (error) => {
                console.error('Error updating user:', error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Błąd',
                  detail: 'Nie udało się zaktualizować użytkownika',
                });
              },
            });
        }
      } else {
        this.apiService
          .registerUser(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sukces',
                detail: 'Użytkownik został utworzony',
              });
              this.loadUsers();
              this.hideDialog();
            },
            error: (error) => {
              console.error('Error creating user:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Błąd',
                detail: 'Nie udało się utworzyć użytkownika',
              });
            },
          });
      }
    }
  }

  deleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć użytkownika ${user.email}?`,
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService
          .delete(`/users/${user.id}`)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sukces',
                detail: 'Użytkownik został usunięty',
              });
              this.loadUsers();
            },
            error: (error) => {
              console.error('Error deleting user:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Błąd',
                detail: 'Nie udało się usunąć użytkownika',
              });
            },
          });
      },
    });
  }

  deleteSelectedUsers(): void {
    const selected = this.selectedUsers();
    if (selected.length === 0) return;

    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć ${selected.length} użytkowników?`,
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Implement bulk delete
        // For now, delete one by one
        const deletePromises = selected.map((user) =>
          this.apiService.delete(`/users/${user.id}`).toPromise()
        );

        Promise.all(deletePromises)
          .then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: `Usunięto ${selected.length} użytkowników`,
            });
            this.selectedUsers.set([]);
            this.loadUsers();
          })
          .catch((error) => {
            console.error('Error deleting users:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się usunąć wszystkich użytkowników',
            });
          });
      },
    });
  }

  getRoleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.STUDENT:
        return 'Student';
      case UserRole.TEACHER:
        return 'Nauczyciel';
      case UserRole.PARENT:
        return 'Rodzic';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'Nieznany';
    }
  }

  getRoleSeverity(role: UserRole): 'success' | 'info' | 'warn' | 'danger' {
    switch (role) {
      case UserRole.STUDENT:
        return 'info';
      case UserRole.TEACHER:
        return 'success';
      case UserRole.PARENT:
        return 'warn';
      case UserRole.ADMIN:
        return 'danger';
      default:
        return 'info';
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  refreshData(): void {
    this.loadUsers();
  }
}
