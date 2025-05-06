import { BehaviorSubject, Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InitialLoadingService {
  private initialLoadingSubject = new BehaviorSubject<boolean>(true);

  public readonly initialLoading$: Observable<boolean> = 
    this.initialLoadingSubject.asObservable();

  constructor() {
    setTimeout(() => {
      this.hideInitialLoading();
    }, 3000);
  }

  public hideInitialLoading(): void {
    this.initialLoadingSubject.next(false);
  }
} 