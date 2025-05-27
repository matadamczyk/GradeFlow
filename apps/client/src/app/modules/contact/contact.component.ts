import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
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
    { label: 'Inne', value: 'other' },
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
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

      setTimeout(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Wiadomość wysłana',
          detail: 'Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin.',
          life: 5000,
        });

        this.contactForm.reset();
        this.isSubmitting.set(false);
      }, 2000);
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
}
