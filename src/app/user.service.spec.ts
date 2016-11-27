/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import {
  BaseRequestOptions, Response, HttpModule, Http, XHRBackend, ResponseOptions,
  RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { UserService } from './user.service';
import { AuthHttp } from 'angular2-jwt';
import { ToastModule } from 'ng2-toastr';

describe('User Service', () => {
  let mockBackend: MockBackend;

  // All heed this block - it is required so that the test injector
  // is properly set up. Without doing this, you won't get the
  // fake backend injected into Http.

  // Also, you need to inject MockBackend as a provider before you wire
  // it to replace XHRBackend with the provide function!  So this is all
  // extremely important to set up right.

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        },
        {
          provide: AuthHttp,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        }
      ],
      imports: [
        HttpModule,
        ToastModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  it('should register a new user using POST', async(() => {
    let userService: UserService = getTestBed().get(UserService);

    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: {
              status: 201,
              message: 'Success. User registered!'
            }
          })
        ));
      });

    let user = {
      username: 'jake123',
      password: 'password',
      confirmPassword: 'password',
      firstName: 'Jake'
    };

    userService.register(user.username, user.password, user.confirmPassword, user.firstName).subscribe(
      (data) => {
        expect(data).toBeDefined();
        expect(data.status).toBe(201);
        expect(data.message).toBe('Success. User registered!');
      });
  }));

  it('should login an existing user using POST', async(() => {
    let userService: UserService = getTestBed().get(UserService);

    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
            body: {
              status: 200,
              message: 'Success. Logged in!'
            }
          })
        ));
      });

    let user = {
      username: 'jake123',
      password: 'password'
    };

    userService.login(user.username, user.password).subscribe(
      (data) => {
        expect(data).toBeDefined();
        expect(data.status).toBe(200);
        expect(data.message).toBe('Success. Logged in!');
      });
  }));

  // NO TEST FOR logout() OR FOR isLoggedIn() OR FOR getUser() - NOT NEEDED
});
