import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { ToastsManager } from 'ng2-toastr';
import { environment } from '../environments/environment';

let baseURL;

if (environment.production) {
  baseURL = '/';
} else {
  baseURL = 'http://localhost:3001/';
}

@Injectable()
export class UserService {
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http, private authHttp: AuthHttp, public toastr: ToastsManager) {
  }

  register(username, password, confirmPassword, firstName) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http
      .post(
        baseURL + 'register',
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
        baseURL + 'login',
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
    if (!localStorage.getItem('id_token')) {
      this.toastr.success('You\'re logged out.', 'Success!');
    }
  }

  isLoggedIn() {
    return tokenNotExpired();
  }

  // todo: possibly move this to a component instead of the service
  getUser() {
    let token = localStorage.getItem('id_token');
    // todo: write some comments here
    let decodedToken = this.jwtHelper.decodeToken(token);

    return this.authHttp.get(baseURL + 'user/' + decodedToken.username)
      .map(res => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }
}
