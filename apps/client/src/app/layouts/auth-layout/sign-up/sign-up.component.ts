import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MessageModule } from 'primeng/message';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, MessageModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {}
