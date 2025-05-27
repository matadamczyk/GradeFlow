import { Component, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { SignInComponent } from '../auth-layout/sign-in/sign-in.component';

@Component({
  selector: 'app-welcome-layout',
  standalone: true,
  imports: [
    CommonModule, 
    ButtonModule, 
    DialogModule,
    SignInComponent
  ],
  templateUrl: './welcome-layout.component.html',
  styleUrl: './welcome-layout.component.scss',
})
export class WelcomeLayoutComponent implements OnInit, OnDestroy {
  title = 'GradeFlow';
  displayedTitle = '';
  private reloadInterval: any;
  private animationInterval: any;

  displayDialog = signal<boolean>(false);

  constructor(private router: Router) {}

  ngOnInit() {
    this.startTitleAnimation();
  }

  ngOnDestroy() {
    if (this.reloadInterval) {
      clearInterval(this.reloadInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private startTitleAnimation() {
    let index = 0;
    this.displayedTitle = '';

    this.animationInterval = setInterval(() => {
      if (index < this.title.length) {
        this.displayedTitle += this.title.charAt(index);
        index++;
      } else {
        clearInterval(this.animationInterval);
      }
    }, 150);
  }

  openLoginDialog() {
    console.log('Welcome - otwieranie dialogu logowania');
    this.displayDialog.set(true);
  }

  openContactForm() {
    this.router.navigate(['/contact']);
  }

  onLoginSuccess() {
    console.log('Welcome - onLoginSuccess wywołane');
    this.displayDialog.set(false);
    
    setTimeout(() => {
      console.log('Welcome - przekierowanie na dashboard');
      this.router.navigate(['/dashboard']);
    }, 100);
  }
}
