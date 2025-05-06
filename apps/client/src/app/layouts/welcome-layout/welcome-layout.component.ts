import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-layout',
  imports: [CommonModule, ButtonModule],
  templateUrl: './welcome-layout.component.html',
  styleUrl: './welcome-layout.component.scss',
})
export class WelcomeLayoutComponent {}
