import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';

// Core imports
import { AuthService, GradesService } from '../../core/services';
import { GradeStatistics, SubjectGrades } from '../../core/models';

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
    DividerModule
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
  currentStudentId = 1; // Domyślnie pierwszy uczeń z mock data
  
  // Table columns
  gradeColumns = [
    { field: 'grade_value', header: 'Ocena' },
    { field: 'date', header: 'Data' },
    { field: 'grade_weight', header: 'Waga' },
    { field: 'comment', header: 'Komentarz' }
  ];

  constructor(
    private gradesService: GradesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGradesData();
  }

  private loadGradesData(): void {
    this.isLoading = true;
    
    // Pobierz statystyki ocen
    this.statistics$ = this.gradesService.getGradeStatistics(this.currentStudentId);
    
    // Pobierz ostatnie oceny
    this.recentGrades$ = this.gradesService.getRecentGrades(this.currentStudentId, 5);
    
    // Pobierz oceny pogrupowane według przedmiotów
    this.subjectGrades$ = this.gradesService.getSubjectGrades(this.currentStudentId);
    
    // Symulacja zakończenia ładowania
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  onSubjectSelect(subjectName: string): void {
    this.selectedSubject = this.selectedSubject === subjectName ? null : subjectName;
  }

  getGradeSeverity(grade: number): "success" | "info" | "warn" | "danger" | "secondary" | "contrast" {
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

  getAverageProgress(average: number): number {
    return (average / 6) * 100;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pl-PL');
  }

  refreshData(): void {
    this.loadGradesData();
  }
}
