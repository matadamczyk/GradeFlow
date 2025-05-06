import { Component, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome-layout',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './welcome-layout.component.html',
  styleUrl: './welcome-layout.component.scss',
})
export class WelcomeLayoutComponent implements OnInit, OnDestroy {
  title = 'GradeFlow';
  displayedTitle = '';
  private reloadInterval: any;
  private animationInterval: any;

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
}
