// Core imports
import { ApiService, AuthService, GradesService } from '../../core/services';
import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GradeStatistics, SubjectGrades } from '../../core/models';
import { catchError, forkJoin, map, of } from 'rxjs';

import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
// Removed deprecated CalendarModule import
// PrimeNG imports
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
// Additional PrimeNG imports for teacher functionality
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { UserRole } from '../../core/models/enums';

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
    // Additional modules for teacher functionality
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    InputTextarea,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: './grades.component.html',
  styleUrl: './grades.component.scss',
  providers: [MessageService],
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

  // Teacher-specific properties
  teacherData = signal<any>(null);
  teacherClasses = signal<any[]>([]);
  teacherSubjects = signal<any[]>([]);
  selectedClass = signal<any>(null);
  selectedClassStudents = signal<any[]>([]);
  selectedClassStudentsWithGrades = signal<any[]>([]);
  classStatistics = signal<any>(null);
  classEvents = signal<any[]>([]);

  // Dialog states
  showAddGradeDialog = false;
  showAddEventDialog = false;
  showStudentGradesDialog = false;
  showEditGradeDialog = false;
  selectedStudent = signal<any>(null);
  selectedStudentGrades = signal<any[]>([]);
  selectedGrade = signal<any>(null);

  // Forms
  addGradeForm!: FormGroup;
  addEventForm!: FormGroup;
  editGradeForm!: FormGroup;

  // Grade types for dropdown
  gradeTypes = [
    { label: 'Sprawdzian', value: 'test' },
    { label: 'Kartkówka', value: 'quiz' },
    { label: 'Praca klasowa', value: 'exam' },
    { label: 'Odpowiedź ustna', value: 'oral' },
    { label: 'Zadanie domowe', value: 'homework' },
    { label: 'Projekt', value: 'project' },
    { label: 'Inne', value: 'other' },
  ];

  // Event types for dropdown
  eventTypes = [
    { label: 'Sprawdzian', value: 'test' },
    { label: 'Kartkówka', value: 'quiz' },
    { label: 'Praca klasowa', value: 'exam' },
    { label: 'Egzamin', value: 'final_exam' },
    { label: 'Projekt', value: 'project' },
    { label: 'Prezentacja', value: 'presentation' },
    { label: 'Wycieczka', value: 'trip' },
    { label: 'Inne', value: 'other' },
  ];

  constructor(
    private gradesService: GradesService,
    private authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser.set(user);
      if (user) {
        this.loadGradesData();
      }
    });
  }

  private initializeForms(): void {
    // Get today's date in YYYY-MM-DD format for HTML date input
    const today = new Date().toISOString().split('T')[0];

    this.addGradeForm = this.fb.group({
      student: ['', Validators.required],
      gradeValue: [
        '',
        [Validators.required, Validators.min(1), Validators.max(6)],
      ],
      gradeWeight: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [''],
      type: ['', Validators.required],
      date: [today, Validators.required],
    });

    this.editGradeForm = this.fb.group({
      gradeValue: [
        '',
        [Validators.required, Validators.min(1), Validators.max(6)],
      ],
      gradeWeight: [
        '',
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comment: [''],
      type: ['', Validators.required],
      date: [today, Validators.required],
    });

    this.addEventForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      date: [today, Validators.required],
      description: [''],
      class: ['', Validators.required],
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

    if (this.isTeacher()) {
      this.loadTeacherData(userId);
    } else if (this.isStudent()) {
      // For students, get student ID first, then load grades
      this.apiService.getStudentByUserId(userId).subscribe({
        next: (student: any) => {
          this.loadStudentGrades(student.id);
        },
        error: (error) => {
          console.error('Grades: Error getting student data:', error);
          this.isLoading = false;
        },
      });
    } else {
      // For other roles, use userId directly
      this.loadGradesByUserId(userId);
    }
  }

  private loadTeacherData(userId: number): void {
    // Get teacher by user ID first
    this.apiService.getTeacherByUserId(userId).subscribe({
      next: (teacher: any) => {
        this.teacherData.set(teacher);

        // Load teacher's classes and subjects
        this.gradesService.getTeacherClasses(teacher.id).subscribe({
          next: (classes: any[]) => {
            // Load student count for each class
            this.loadClassesWithStudentCounts(classes);
          },
          error: (error) =>
            console.error('Error loading teacher classes:', error),
        });

        this.gradesService.getTeacherSubjects(teacher.id).subscribe({
          next: (subjects: any[]) => {
            this.teacherSubjects.set(subjects);
          },
          error: (error) =>
            console.error('Error loading teacher subjects:', error),
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error getting teacher data:', error);
        this.isLoading = false;
      },
    });
  }

  private loadClassesWithStudentCounts(classes: any[]): void {
    // Create an array of observables to load student counts for each class
    const classRequests = classes.map((classData) =>
      this.apiService.getStudentsByClass(classData.id).pipe(
        map((students) => ({
          ...classData,
          studentsCount: students.length,
          displayName: `${classData.number}${classData.letter} (${students.length} uczniów)`,
        })),
        catchError((error) => {
          console.error(
            `Error loading students for class ${classData.id}:`,
            error
          );
          return of({
            ...classData,
            studentsCount: 0,
            displayName: `${classData.number}${classData.letter} (0 uczniów)`,
          });
        })
      )
    );

    // Execute all requests and combine results
    forkJoin(classRequests).subscribe({
      next: (classesWithCounts) => {
        this.teacherClasses.set(classesWithCounts);
      },
      error: (error) => {
        console.error('Error loading classes with student counts:', error);
        // Fallback to classes without student count data
        const fallbackClasses = classes.map((classData) => ({
          ...classData,
          studentsCount: 0,
          displayName: `${classData.number}${classData.letter} (0 uczniów)`,
        }));
        this.teacherClasses.set(fallbackClasses);
      },
    });
  }

  private loadStudentGrades(studentId: number): void {
    // Pobierz statystyki ocen
    this.statistics$ = this.gradesService.getGradeStatistics(studentId);

    // Pobierz ostatnie oceny
    this.recentGrades$ = this.gradesService.getRecentGrades(studentId, 5);

    // Pobierz oceny pogrupowane według przedmiotów
    this.subjectGrades$ = this.gradesService.getSubjectGrades(studentId);

    // Finished loading
    this.isLoading = false;
  }

  private loadGradesByUserId(userId: number): void {
    // Pobierz statystyki ocen
    this.statistics$ = this.gradesService.getGradeStatistics(userId);

    // Pobierz ostatnie oceny
    this.recentGrades$ = this.gradesService.getRecentGrades(userId, 5);

    // Pobierz oceny pogrupowane według przedmiotów
    this.subjectGrades$ = this.gradesService.getSubjectGrades(userId);

    // Finished loading
    this.isLoading = false;
  }

  // Teacher-specific methods

  onClassSelect(classData: any): void {
    this.selectedClass.set(classData);
    this.loadClassStudents(classData.id);
    this.loadClassStatistics(classData.id);
    this.loadClassEvents(classData.id);
  }

  private loadClassStudents(classId: number): void {
    this.gradesService.getStudentsForClass(classId).subscribe({
      next: (students: any[]) => {
        this.selectedClassStudents.set(students);

        // Load grade statistics for each student
        this.loadStudentsWithGrades(students);
      },
      error: (error) => console.error('Error loading class students:', error),
    });
  }

  private loadStudentsWithGrades(students: any[]): void {
    const subjects = this.teacherSubjects();
    if (subjects.length === 0) {
      this.selectedClassStudentsWithGrades.set(
        students.map((student) => ({
          ...student,
          average: 0,
          gradeCount: 0,
          lastGrade: null,
          lastGradeDate: null,
          grades: [],
        }))
      );
      return;
    }

    const teacherSubjectId = subjects[0].id; // Use first subject for now

    // Create an array of observables for each student's grades
    const gradeRequests = students.map((student) =>
      this.apiService
        .getGradesByStudentAndTeacherSubject(student.id, teacherSubjectId)
        .pipe(
          map((grades) => {
            // Calculate weighted average instead of arithmetic average
            const totalWeightedScore = grades.reduce(
              (sum: number, grade: any) =>
                sum + grade.grade_value * (grade.grade_weight || 1),
              0
            );
            const totalWeight = grades.reduce(
              (sum: number, grade: any) => sum + (grade.grade_weight || 1),
              0
            );
            const average =
              totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

            const sortedGrades = grades.sort(
              (a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            const lastGrade = sortedGrades.length > 0 ? sortedGrades[0] : null;

            return {
              ...student,
              average: Math.round(average * 100) / 100,
              gradeCount: grades.length,
              lastGrade: lastGrade?.grade_value || null,
              lastGradeDate: lastGrade?.date || null,
              grades: grades,
            };
          }),
          catchError((error) => {
            console.error(
              `Error loading grades for student ${student.id}:`,
              error
            );
            return of({
              ...student,
              average: 0,
              gradeCount: 0,
              lastGrade: null,
              lastGradeDate: null,
              grades: [],
            });
          })
        )
    );

    // Execute all requests and combine results
    forkJoin(gradeRequests).subscribe({
      next: (studentsWithGrades) => {
        this.selectedClassStudentsWithGrades.set(studentsWithGrades);
      },
      error: (error) => {
        console.error('Error loading students with grades:', error);
        // Fallback to students without grade data
        this.selectedClassStudentsWithGrades.set(
          students.map((student) => ({
            ...student,
            average: 0,
            gradeCount: 0,
            lastGrade: null,
            lastGradeDate: null,
            grades: [],
          }))
        );
      },
    });
  }

  private loadClassStatistics(classId: number): void {
    const subjects = this.teacherSubjects();
    if (subjects.length > 0) {
      // Use first subject for now, in real app teacher would select
      const teacherSubjectId = subjects[0].id;

      this.gradesService
        .getClassStatistics(classId, teacherSubjectId)
        .subscribe({
          next: (statistics: any) => {
            this.classStatistics.set(statistics);
          },
          error: (error) =>
            console.error('Error loading class statistics:', error),
        });
    }
  }

  private loadClassEvents(classId: number): void {
    this.gradesService.getEventsByClass(classId).subscribe({
      next: (events: any[]) => {
        this.classEvents.set(events);
      },
      error: (error) => console.error('Error loading class events:', error),
    });
  }

  // Dialog methods

  openAddGradeDialog(student?: any): void {
    this.selectedStudent.set(student);
    if (student) {
      this.addGradeForm.patchValue({ student: student });
    }

    this.showAddGradeDialog = true;
  }

  closeAddGradeDialog(): void {
    this.showAddGradeDialog = false;
    this.addGradeForm.reset();
    this.selectedStudent.set(null);
  }

  openAddEventDialog(): void {
    const selectedClass = this.selectedClass();
    if (selectedClass) {
      this.addEventForm.patchValue({ class: selectedClass });
    }
    this.showAddEventDialog = true;
  }

  closeAddEventDialog(): void {
    this.showAddEventDialog = false;
    this.addEventForm.reset();
  }

  // Student grades dialog methods
  openStudentGradesDialog(student: any): void {
    this.selectedStudent.set(student);
    this.selectedStudentGrades.set(student.grades || []);
    this.showStudentGradesDialog = true;
  }

  closeStudentGradesDialog(): void {
    this.showStudentGradesDialog = false;
    this.selectedStudent.set(null);
    this.selectedStudentGrades.set([]);
  }

  // Edit grade dialog methods
  openEditGradeDialog(grade: any): void {
    this.selectedGrade.set(grade);
    const gradeDate = new Date(grade.date).toISOString().split('T')[0];

    this.editGradeForm.patchValue({
      gradeValue: grade.grade_value,
      gradeWeight: grade.grade_weight,
      comment: grade.comment || '',
      type: grade.type || 'other',
      date: gradeDate,
    });

    this.showEditGradeDialog = true;
  }

  closeEditGradeDialog(): void {
    this.showEditGradeDialog = false;
    this.editGradeForm.reset();
    this.selectedGrade.set(null);
  }

  // Helper methods for student data
  getGradeTrend(student: any): {
    trend: 'positive' | 'negative' | 'neutral';
    value: number;
  } {
    if (!student.grades || student.grades.length < 2) {
      return { trend: 'neutral', value: 0 };
    }

    const sortedGrades = student.grades.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const recentGrades = sortedGrades.slice(-3); // Last 3 grades
    const olderGrades = sortedGrades.slice(0, sortedGrades.length - 3);

    if (olderGrades.length === 0) {
      return { trend: 'neutral', value: 0 };
    }

    // Calculate weighted averages instead of arithmetic averages
    const recentTotalWeightedScore = recentGrades.reduce(
      (sum: number, grade: any) =>
        sum + grade.grade_value * (grade.grade_weight || 1),
      0
    );
    const recentTotalWeight = recentGrades.reduce(
      (sum: number, grade: any) => sum + (grade.grade_weight || 1),
      0
    );
    const recentAverage =
      recentTotalWeight > 0 ? recentTotalWeightedScore / recentTotalWeight : 0;

    const olderTotalWeightedScore = olderGrades.reduce(
      (sum: number, grade: any) =>
        sum + grade.grade_value * (grade.grade_weight || 1),
      0
    );
    const olderTotalWeight = olderGrades.reduce(
      (sum: number, grade: any) => sum + (grade.grade_weight || 1),
      0
    );
    const olderAverage =
      olderTotalWeight > 0 ? olderTotalWeightedScore / olderTotalWeight : 0;

    const difference = recentAverage - olderAverage;

    if (Math.abs(difference) < 0.1) {
      return { trend: 'neutral', value: 0 };
    }

    return {
      trend: difference > 0 ? 'positive' : 'negative',
      value: Math.round(Math.abs(difference) * 10) / 10,
    };
  }

  refreshStudentData(): void {
    const classId = this.selectedClass()?.id;
    if (classId) {
      this.loadClassStudents(classId);
    }
  }

  // Form submission methods

  onSubmitGrade(): void {
    if (this.addGradeForm.valid) {
      const formValue = this.addGradeForm.value;

      // Get the first available lesson for this class and teacher subject
      this.apiService
        .getTimetableByStudentClass(this.selectedClass().id)
        .subscribe({
          next: (timetable) => {
            // Find a lesson for the teacher subject
            const teacherSubjectId = this.teacherSubjects()[0]?.id;
            const lesson = timetable.find(
              (t) => t.teacherSubject?.id === teacherSubjectId
            );
            const lessonId = lesson?.lesson_id || 1; // Fallback to 1 if no lesson found

            const gradeData = {
              student_id: formValue.student.id,
              teacher_subject_id: teacherSubjectId,
              lesson_id: lessonId,
              grade_value: parseFloat(formValue.gradeValue),
              grade_weight: parseInt(formValue.gradeWeight),
              comment: formValue.comment || '',
              date: formValue.date, // Backend should handle date conversion
            };

            this.gradesService.addGrade(gradeData).subscribe({
              next: (_result) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sukces',
                  detail: 'Ocena została dodana pomyślnie',
                });
                this.closeAddGradeDialog();
                // Refresh data
                this.loadClassStatistics(this.selectedClass().id);
                this.refreshStudentData();
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Błąd',
                  detail: 'Nie udało się dodać oceny',
                });
                console.error('Error adding grade:', error);
              },
            });
          },
          error: (error) => {
            console.error('Error getting timetable:', error);
            // Fallback: use hardcoded lesson_id
            const gradeData = {
              student_id: formValue.student.id,
              teacher_subject_id: this.teacherSubjects()[0]?.id,
              lesson_id: 1,
              grade_value: parseFloat(formValue.gradeValue),
              grade_weight: parseInt(formValue.gradeWeight),
              comment: formValue.comment || '',
              date: formValue.date,
            };

            this.gradesService.addGrade(gradeData).subscribe({
              next: (_result) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sukces',
                  detail: 'Ocena została dodana pomyślnie',
                });
                this.closeAddGradeDialog();
                this.loadClassStatistics(this.selectedClass().id);
                this.refreshStudentData();
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Błąd',
                  detail: 'Nie udało się dodać oceny',
                });
                console.error('Error adding grade:', error);
              },
            });
          },
        });
    }
  }

  onSubmitEvent(): void {
    if (this.addEventForm.valid) {
      const formValue = this.addEventForm.value;
      const eventData = {
        title: formValue.title,
        type: formValue.type,
        date: formValue.date,
        description: formValue.description,
        classId: formValue.class.id,
      };

      this.gradesService.createEvent(eventData).subscribe({
        next: (_result) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Wydarzenie zostało utworzone pomyślnie',
          });
          this.closeAddEventDialog();
          // Refresh events
          this.loadClassEvents(this.selectedClass().id);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się utworzyć wydarzenia',
          });
          console.error('Error creating event:', error);
        },
      });
    }
  }

  onSubmitEditGrade(): void {
    if (this.editGradeForm.valid && this.selectedGrade()) {
      const formValue = this.editGradeForm.value;
      const selectedGrade = this.selectedGrade();

      const gradeData = {
        teacher_subject_id:
          selectedGrade.teacherSubject?.id || this.teacherSubjects()[0]?.id,
        lesson_id: selectedGrade.lesson?.lesson_id || 1,
        grade_value: parseFloat(formValue.gradeValue),
        grade_weight: parseInt(formValue.gradeWeight),
        comment: formValue.comment || '',
        date: formValue.date,
      };

      this.gradesService.updateGrade(selectedGrade.id, gradeData).subscribe({
        next: (_result: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Ocena została zaktualizowana pomyślnie',
          });
          this.closeEditGradeDialog();
          // Refresh data
          this.loadClassStatistics(this.selectedClass().id);
          this.refreshStudentData();
          // Update the selected student grades if dialog is open
          if (this.showStudentGradesDialog && this.selectedStudent()) {
            const updatedStudent = this.selectedClassStudentsWithGrades().find(
              (s) => s.id === this.selectedStudent().id
            );
            if (updatedStudent) {
              this.selectedStudentGrades.set(updatedStudent.grades || []);
            }
          }
        },
        error: (error: any) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się zaktualizować oceny',
          });
          console.error('Error updating grade:', error);
        },
      });
    }
  }

  // Existing methods (keeping for student view)

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
      case 6:
        return 'Celujący';
      case 5:
        return 'Bardzo dobry';
      case 4:
        return 'Dobry';
      case 3:
        return 'Dostateczny';
      case 2:
        return 'Dopuszczający';
      case 1:
        return 'Niedostateczny';
      default:
        return 'Nieokreślona';
    }
  }

  getAverageProgress(average: number): number {
    return (average / 6) * 100;
  }

  getBestGrade(stats: GradeStatistics): number | null {
    if (!stats?.subjectGrades || stats.subjectGrades.length === 0) {
      return null;
    }

    let bestGrade = 0;
    stats.subjectGrades.forEach((subject: SubjectGrades) => {
      if (subject.grades && subject.grades.length > 0) {
        subject.grades.forEach((grade: { grade_value: number }) => {
          if (grade.grade_value > bestGrade) {
            bestGrade = grade.grade_value;
          }
        });
      }
    });

    return bestGrade > 0 ? bestGrade : null;
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

  trackByStudent(index: number, item: any): any {
    return item.id || index;
  }

  trackByClass(index: number, item: any): any {
    return item.id || index;
  }

  trackByEvent(index: number, item: any): any {
    return item.id || index;
  }

  // Helper methods for teacher view

  getEventTypeLabel(type: string): string {
    const eventType = this.eventTypes.find((et) => et.value === type);
    return eventType ? eventType.label : type;
  }

  getEventTypeSeverity(
    type: string
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (type) {
      case 'test':
      case 'exam':
      case 'final_exam':
        return 'danger';
      case 'quiz':
        return 'warn';
      case 'project':
      case 'presentation':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getGradeDistributionData(distribution: any): any {
    return {
      labels: [
        'Celujący/Bardzo dobry',
        'Dobry',
        'Dostateczny',
        'Niedostateczny',
      ],
      datasets: [
        {
          data: [
            distribution.excellent,
            distribution.good,
            distribution.satisfactory,
            distribution.poor,
          ],
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
        },
      ],
    };
  }
}
