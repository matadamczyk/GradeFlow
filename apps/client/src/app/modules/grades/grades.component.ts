// Core imports
import { AuthService, GradesService } from '../../core/services';
import { Component, OnInit, computed, signal } from '@angular/core';
import { GradeStatistics, SubjectGrades } from '../../core/models';
import { UserRole } from '../../core/models/enums';

import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { Observable } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-grades',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    ProgressBarModule,
    SkeletonModule,
    AccordionModule,
    BadgeModule,
    TooltipModule,
    DividerModule,
  ],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss',
})
export class GradesComponent implements OnInit {
  statistics$!: Observable<GradeStatistics>;
  recentGrades$!: Observable<any[]>;
  subjectGrades$!: Observable<SubjectGrades[]>;

  selectedSubject: string | null = null;
  isLoading = true;
  currentUser = signal<any>(null);

  // Role-specific computed properties
  userRole = computed(() => this.currentUser()?.role);
  isStudent = computed(() => this.userRole() === UserRole.STUDENT);
  isTeacher = computed(() => this.userRole() === UserRole.TEACHER);
  isParent = computed(() => this.userRole() === UserRole.PARENT);
  isAdmin = computed(() => this.userRole() === UserRole.ADMIN);

  UserRole = UserRole;
  // Expose Math to template
  Math = Math;

  // Table columns
  gradeColumns = [
    { field: 'grade_value', header: 'Ocena' },
    { field: 'date', header: 'Data' },
    { field: 'grade_weight', header: 'Waga' },
    { field: 'comment', header: 'Komentarz' },
  ];

  constructor(
    private gradesService: GradesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        this.loadGradesData();
      }
    });
  }

  private loadGradesData(): void {
    this.isLoading = true;
    const user = this.currentUser();
    
    if (!user) {
      this.isLoading = false;
      return;
    }

    const userId = user.id;

    // Pobierz statystyki ocen
    this.statistics$ = this.gradesService.getGradeStatistics(userId);

    // Pobierz ostatnie oceny
    this.recentGrades$ = this.gradesService.getRecentGrades(userId, 5);

    // Pobierz oceny pogrupowane według przedmiotów
    this.subjectGrades$ = this.gradesService.getSubjectGrades(userId);

    // Symulacja zakończenia ładowania
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onSubjectSelect(subjectName: string): void {
    this.selectedSubject =
      this.selectedSubject === subjectName ? null : subjectName;
  }

  getGradeSeverity(
    grade: number
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    if (grade >= 5) return 'success';
    if (grade >= 4) return 'info';
    if (grade >= 3) return 'warn';
    if (grade >= 2) return 'danger';
    return 'danger';
  }

  getGradeIcon(grade: number): string {
    if (grade >= 5) return 'pi pi-star-fill';
    if (grade >= 4) return 'pi pi-thumbs-up';
    if (grade >= 3) return 'pi pi-minus';
    if (grade >= 2) return 'pi pi-thumbs-down';
    return 'pi pi-times';
  }

  getGradeDescription(grade: number): string {
    switch (grade) {
      case 6: return 'Celujący';
      case 5: return 'Bardzo dobry';
      case 4: return 'Dobry';
      case 3: return 'Dostateczny';
      case 2: return 'Dopuszczający';
      case 1: return 'Niedostateczny';
      default: return 'Nieokreślona';
    }
  }

  getAverageProgress(average: number): number {
    return (average / 6) * 100;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pl-PL');
  }

  refreshData(): void {
    this.loadGradesData();
  }

  // Track functions for performance optimization
  trackByGrade(index: number, item: any): any {
    return item.id || index;
  }

  trackBySubject(index: number, item: SubjectGrades): any {
    return item.subjectName || index;
  }
}
