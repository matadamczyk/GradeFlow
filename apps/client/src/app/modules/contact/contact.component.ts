import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { ApiService } from '../../core/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClient } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    CheckboxModule,
    AccordionModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = signal<boolean>(false);

  subjectOptions = [
    { label: 'Pytanie ogólne', value: 'general' },
    { label: 'Problem techniczny', value: 'technical' },
    { label: 'Problem z logowaniem', value: 'login' },
    { label: 'Problem z ocenami', value: 'grades' },
    { label: 'Problem z planem zajęć', value: 'timetable' },
    { label: 'Sugestia/Feedback', value: 'feedback' },
    { label: 'Założenie konta', value: 'account-creation' },
    { label: 'Inne', value: 'other' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]],
      privacy: [false, Validators.requiredTrue],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);

      const formData = this.contactForm.value;

      // Send all contact messages to the backend
      this.sendContactMessage(formData);
    } else {
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });

      this.messageService.add({
        severity: 'error',
        summary: 'Błąd formularza',
        detail: 'Proszę poprawić błędy w formularzu',
        life: 3000,
      });
    }
  }

  private sendContactMessage(formData: any): void {
    const requestData = {
      email: formData.email,
      name: formData.name,
      subject: formData.subject,
      message: formData.message,
    };

    this.apiService.post('/contact/send', requestData).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Wiadomość wysłana',
          detail:
            response.message ||
            'Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin.',
          life: 5000,
        });
        this.contactForm.reset();
        this.isSubmitting.set(false);
      },
      error: (error) => {
        console.error('Błąd podczas wysyłania wiadomości:', error);

        // Handle different types of errors
        let errorMessage =
          'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie.';

        if (error.error && error.error.error) {
          errorMessage = error.error.error;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Błąd wysyłania',
          detail: errorMessage,
          life: 5000,
        });
        this.isSubmitting.set(false);
      },
    });
  }
}
