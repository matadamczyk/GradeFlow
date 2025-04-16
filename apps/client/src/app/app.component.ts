import { ButtonModule } from 'primeng/button';
import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MainLayoutComponent } from './layouts';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule, ButtonModule, InputTextModule, MainLayoutComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GradeFlow';
}
