import { Component, output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-sign-in',
  imports: [
    CommonModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  isLoggedIn = output<boolean>();

  login() {
    this.isLoggedIn.emit(true);
  }
}
