import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, ProgressBarModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnInit {
  isLoading = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
} 