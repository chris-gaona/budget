// Imports
import { Injectable } from '@angular/core';
import { Budget } from './budget';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AuthHttp } from 'angular2-jwt';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../environments/environment';

let baseURL;

if (environment.production) {
  baseURL = '/api/budgets';
} else {
  baseURL = 'http://localhost:3001/api/budgets';
}

@Injectable()
export class BudgetService {
  // placeholder for budgets
  budgets: Budget[] = [];

  // Resolve HTTP using the constructor
  constructor(private http: Http, private authHttp: AuthHttp) { }

  // get all budgets
  getAllBudgets(): Observable<Budget[]> {
    return this.authHttp.get(baseURL)
      // With the map operator, we call the .json method on the response because the actual
      // response is not a collection of data but a JSON string.
      .map(res => res.json())
      // It is always advisable to handle errors so we can use the catch
      // operator to return another subscribe observable but this time a failed one.
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }

  // get a single budget
  getBudgetById(id: number): Observable<Budget> {
    return this.authHttp.get(`${baseURL}/${id}`)
      .map(res => res.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }

  // add new budget
  addBudget(budget: Budget): Observable<Budget> {
    // let bodyString = JSON.stringify(budget); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.authHttp.post(baseURL, budget, options) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); // ...errors if
  }

  // update existing budget
  updateBudgetById(id: number, budget: Object): Observable<Budget> {
    // let bodyString = JSON.stringify(budget); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.authHttp.put(`${baseURL}/${id}`, budget, options) // ...using put request
      .map(res => res.json()) // ...and calling .json() on the response to return data
      .catch((err: any) => Observable.throw(err.json().error || 'Server error')); // ...errors if any
  }

  // delete an existing budget
  deleteBudgetById(id: number): Observable<Budget> {
    return this.authHttp.delete(`${baseURL}/${id}`) // ...using put request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .catch((err: any) => Observable.throw(err.json().error || 'Server error')); // ...errors if
  }
}
