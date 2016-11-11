import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

  private loggedIn = false;

  // resolve http using the constructor
  constructor(private http: Http) {
  }

  // check user input credentials
  login(email, password) {
    return this.http.get('http://localhost:3000/users')
      .map(res => {
        res.json();

        if (res.json()[0].email === email && res.json()[0].password === password) {
          this.loggedIn = true;
        }
      })
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }

  logout() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
