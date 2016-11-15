import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

let codes = require('../config.json');

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
  // Configure Auth0
  lock = new Auth0Lock(codes.clientid, codes.domain, {});

  constructor() {
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);

      console.log(authResult);

      // Fetch profile information
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          // Handle error
          alert(error);
          return;
        }

        console.log(profile);

        localStorage.setItem('profile', JSON.stringify(profile));
      });
    });
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show();
  };

  authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  logout() {
    // Remove token and profile from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  };

  getUserInfo() {
    if (localStorage.getItem('profile')) {
      return JSON.parse(localStorage.getItem('profile'));
    }
  }
}
