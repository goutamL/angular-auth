import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import decode from 'jwt-decode';
import { API_URL } from './../app.constants';

@Injectable()
export class AuthService {
  constructor(public http: HttpClient, public router: Router) {}

  login(credentials: any): Observable<any> {
    const user = {
      user: credentials.email,
      password: credentials.password
    };
    return this.http.post(`${API_URL}/users/authenticate`, user);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['home']);
  }

  setSession(token: string): void {
    localStorage.setItem('token', token);
    this.router.navigate(['home']);
  }

  getToken(): String {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    return token;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    let expiryDate = new Date(0);
    const exp = decode(token).exp;
    expiryDate.setUTCSeconds(exp);
    return expiryDate.valueOf() > new Date().valueOf();
  }

  hasRole(role: string): boolean {
    const token: any = this.getToken();
    const roleClaim = decode(token).role;
    console.log(roleClaim);
    return roleClaim === role;
  }
}
