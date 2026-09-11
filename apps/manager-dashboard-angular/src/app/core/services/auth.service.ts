import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginDto, AuthResponse, UserRole } from '@dormflow/shared-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('dormflow_manager_user');
    if (saved) {
      try {
        this.currentUserSubject.next(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public getToken(): string | null {
    return localStorage.getItem('dormflow_manager_token');
  }

  public login(dto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', dto).pipe(
      tap(res => {
        localStorage.setItem('dormflow_manager_token', res.accessToken);
        localStorage.setItem('dormflow_manager_user', JSON.stringify(res.user));
        this.currentUserSubject.next(res.user);
      }),
    );
  }

  public logout(): void {
    localStorage.removeItem('dormflow_manager_token');
    localStorage.removeItem('dormflow_manager_user');
    this.currentUserSubject.next(null);
  }

  public isStaff(): boolean {
    const role = this.currentUserValue?.role;
    return role === UserRole.MANAGER || role === UserRole.TECHNICIAN;
  }
}
