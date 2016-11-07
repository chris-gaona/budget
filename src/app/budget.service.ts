// Imports
import { Injectable } from '@angular/core';
import { Budget } from './budget';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class BudgetService {
  // placeholder for budgets
  budgets: Budget[] = [];

  // Placeholder for last id so we can simulate
  // automatic incrementing of id's
  lastId: number = 2;

  // Resolve HTTP using the constructor
  constructor(private http: Http) {
    // adds mock data
    // let mockBudget1 = new Budget({
    //   id: 1,
    //   start_period: new Date('9/24/2016'),
    //   existing_cash: 22525,
    //   current_income: 1800,
    //   budget_items: [
    //     {
    //       editing: false,
    //       item: 'gas',
    //       projection: 200,
    //       actual: [
    //         {
    //           name: 'Done 10/15',
    //           amount: 35
    //         }
    //       ]
    //     },
    //     {
    //       editing: false,
    //       item: 'food',
    //       projection: 250,
    //       actual: [
    //         {
    //           name: 'Trader Joe\'s',
    //           amount: 125
    //         },
    //         {
    //           name: 'Safeway',
    //           amount: 55
    //         }
    //       ]
    //     },
    //     {
    //       editing: false,
    //       item: 'other',
    //       projection: 250,
    //       actual: [
    //         {
    //           name: 'Blah blah',
    //           amount: 75
    //         }
    //       ]
    //     }
    //   ]
    // });
    //
    // let mockBudget2 = new Budget({
    //   id: 2,
    //   start_period: new Date('10/5/2016'),
    //   existing_cash: 25525,
    //   current_income: 1650,
    //   budget_items: [
    //     {
    //       editing: false,
    //       item: 'gas',
    //       projection: 140,
    //       actual: [
    //         {
    //           name: 'Done 10/15',
    //           amount: 55
    //         }
    //       ]
    //     },
    //     {
    //       editing: false,
    //       item: 'food',
    //       projection: 190,
    //       actual: [
    //         {
    //           name: 'Trader Joe\'s',
    //           amount: 165
    //         }
    //       ]
    //     },
    //     {
    //       editing: false,
    //       item: 'other',
    //       projection: 50,
    //       actual: [
    //         {
    //           name: 'Blah blah',
    //           amount: 92
    //         }
    //       ]
    //     }
    //   ]
    // });
    //
    // this.addBudget(mockBudget1);
    // this.addBudget(mockBudget2);
  }

  // private instance variable to hold base url
  private budgetsURL = 'http://localhost:3000/budgets';

  // get all budgets
  getAllBudgets(): Observable<Budget[]> {
    // return this.budgets;
    return this.http.get(this.budgetsURL)
      // With the map operator, we call the .json method on the response because the actual response is not a collection of data but a JSON string.
      .map(response => response.json())
      // It is always advisable to handle errors so we can use the catch operator to return another subscribable observable but this time a failed one.
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }

  // get a single budget
  getBudgetById(id: number): Observable<Budget> {
    // return this.budgets
    //   .filter(budget => budget.id === id)
    //   .pop();

    return this.http.get(`${this.budgetsURL}/${id}`)
      .map(response => response.json())
      .catch((err: any) => Observable.throw(err.json().error || 'Server Error'));
  }

  // add new budget
  addBudget(budget: Budget): Observable<Budget> {
    // if (!budget.id) {
    //   budget.id = ++this.lastId;
    // }
    //
    // this.budgets.push(budget);
    // return this;

    let bodyString = JSON.stringify(budget); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.budgetsURL, budget, options) // ...using post request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .catch((error:any) => Observable.throw(error.json().error || 'Server error')); //...errors if
  }

  // update existing budget
  updateBudgetById(id: number, budget: Object): Observable<Budget> {
    // let budget = this.getBudgetById(id);
    // console.log(budget);
    // if (!budget) {
    //   return null;
    // }
    // // loop through all budget items
    // for (let i = 0; i < budget.budget_items.length; i++) {
    //   // mark each budget item as editing false
    //   budget.budget_items[i].editing = false;
    // }
    // // assign the new values to the budget
    // Object.assign(budget, values);
    // return budget;

    // let bodyString = JSON.stringify(budget); // Stringify payload
    let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.put(`${this.budgetsURL}/${id}`, budget, options) // ...using put request
      .map(response => response.json()) // ...and calling .json() on the response to return data
      .catch((err:any) => Observable.throw(err.json().error || 'Server error')); //...errors if any
  }

  // delete an existing budget
  deleteBudgetById(id: number): Observable<Budget> {
    // filter() method creates a new array with all elements that pass the test implemented by the provided function
    // this.budgets = this.budgets
    //   .filter(budget => budget.id !== id);
    // return this;

    return this.http.delete(`${this.budgetsURL}/${id}`) // ...using put request
      .map((res) => res.json()) // ...and calling .json() on the response to return data
      .catch((err:any) => Observable.throw(err.json().error || 'Server error')); //...errors if
  }
}
