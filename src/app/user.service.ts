import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private authHttp: AuthHttp) {
  }

  register(username, password, confirmPassword, firstName) {
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
          localStorage.setItem('id_token', res.token);
        }

        return res;
      });
  }

  login(username, password) {
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
          localStorage.setItem('id_token', res.token);
        }

        return res;
      });
  }

  logout() {
    localStorage.removeItem('id_token');
    this.isLoggedIn();
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  // todo: possibly move this to a component instead of the service
  getUser() {
    let token = localStorage.getItem('id_token');
    // todo: write some comments here
    let decodedToken = this.jwtHelper.decodeToken(token);

    return this.authHttp.get('http://localhost:3001/user/' + decodedToken.username)
      .map(res => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }
}
