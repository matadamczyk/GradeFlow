import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { LoadingComponent } from './core';
import { MainLayoutComponent } from './layouts';
import { RouterModule } from '@angular/router';

@Component({
  imports: [
    RouterModule,
    ButtonModule,
    InputTextModule,
    MainLayoutComponent,
    LoadingComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'GradeFlow';
}
