import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  
  public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  public showLoading(): void {
    this.loadingSubject.next(true);
  }

  public hideLoading(): void {
    this.loadingSubject.next(false);
  }
} 