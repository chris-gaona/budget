import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class UserService {

  constructor(private http: Http) {
  }

  register(username, password, confirmPassword, firstName) {
    console.log(JSON.stringify({ username, password, confirmPassword, firstName }));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
        'http://localhost:3001/register',
        JSON.stringify({ username, password, confirmPassword, firstName }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res) {
          localStorage.setItem('auth_token', res.token);
        }

        return res;
      });
  }

  login(username, password) {
    console.log(JSON.stringify({ username, password }));

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
        'http://localhost:3001/login',
        JSON.stringify({ username, password }),
        { headers }
      )
      .map(res => res.json())
      .map((res) => {
        if (res) {
          localStorage.setItem('auth_token', res.token);
        }

        return res;
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn() {
    return tokenNotExpired('auth_token');
  }
}
