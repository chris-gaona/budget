// /* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import {
  BaseRequestOptions, Response, HttpModule, Http, XHRBackend, ResponseOptions,
  RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BudgetService } from './budget.service';
import {Budget, BudgetItems, ActualItems} from './budget';

describe('BudgetService', () => {
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
        BudgetService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory:
            (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
              return new Http(backend, defaultOptions);
            }
        }
      ],
      imports: [
        HttpModule
      ]
    });
    mockBackend = getTestBed().get(MockBackend);
  }));

  it('should get all budget entries', async(() => {
    let budgetService: BudgetService = getTestBed().get(BudgetService);

    mockBackend.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(
          new ResponseOptions({
              body: [
                {
                  id: 1,
                  start_period: '2016-09-24T07:00:00.000Z',
                  existing_cash: 22525,
                  current_income: 1800,
                  budget_items: [
                    {
                      editing: false,
                      item: 'gas',
                      projection: 200,
                      actual: [
                        {
                          name: 'Done 10/15',
                          amount: 35
                        }
                      ]
                    }
                  ]
                },
                {
                  id: 2,
                  start_period: '2016-10-05T07:00:00.000Z',
                  existing_cash: 25525,
                  current_income: 1650,
                  budget_items: [
                    {
                      editing: false,
                      item: 'gas',
                      projection: 140,
                      actual: [
                        {
                          name: 'Done 10/15',
                          amount: 55
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          )));
      });
    budgetService.getAllBudgets().subscribe(
      (data) => {
        expect(data.length).toBe(2);
        expect(data[0].id).toBe(1);
        expect(data[0].existing_cash).toEqual(22525);
        expect(data[0].current_income).toEqual(1800);
        expect(data[0].budget_items.length).toBe(1);
        expect(data[0].budget_items[0].actual.length).toBe(1);

        expect(data[1].id).toBe(2);
        expect(data[1].existing_cash).toEqual(25525);
        expect(data[1].current_income).toEqual(1650);
        expect(data[1].budget_items.length).toBe(1);
        expect(data[1].budget_items[0].actual.length).toBe(1);
      });
  }));

  it('should get a single budget entry by id', async(inject([BudgetService], (budgetService) => {
    mockBackend.connections.subscribe(
      (connection: MockConnection) => {

        // make sure the URL is correct
        expect(connection.request.url).toMatch(/3000\/budgets\/3/);
        connection.mockRespond(
          new Response(
            new ResponseOptions({
              body: {
                id: 3,
                start_period: '2016-09-24T07:00:00.000Z',
                existing_cash: 22525,
                current_income: 1800,
                budget_items: [
                  {
                    editing: false,
                    item: 'gas',
                    projection: 200,
                    actual: [
                      {
                        name: 'Done 10/15',
                        amount: 35
                      }
                    ]
                  },
                  {
                    editing: false,
                    item: 'gas',
                    projection: 200,
                    actual: [
                      {
                        name: 'Done 10/15',
                        amount: 35
                      }
                    ]
                  }
                ]
              }
            }))
        );
      });

    budgetService.getBudgetById(3).subscribe(
      (data) => {
        expect(data.id).toBe(3);
        expect(data.existing_cash).toBe(22525);
        expect(data.current_income).toBe(1800);
        expect(data.budget_items.length).toBe(2);
        expect(data.budget_items[0].actual.length).toBe(1);
      });
  })));

  it('should insert new budget entries', async(inject([BudgetService], (budgetService) => {
    mockBackend.connections.subscribe((connection: MockConnection) => {
      // is it the correct REST type for an insert? (POST)
      expect(connection.request.method).toBe(RequestMethod.Post);
      // okey dokey,
      connection.mockRespond(new Response(new ResponseOptions({body: { status: 201 }})));
    });

    let actualItems = new ActualItems(
      {
        name: 'Done 10/15'
      }
    );

    let budgetItems = new BudgetItems(
      {
        item: 'gas',
        projection: 200,
        actual: [actualItems]
      }
    );

    let budget = new Budget({
      id: 1,
      start_period: new Date('10/29/2016'),
      existing_cash: 22525,
      budget_items: [budgetItems]
    });

    budgetService.addBudget(budget).subscribe(
      (data) => {
        expect(data).toBeDefined();
        expect(data.status).toBe(201);
      });
  })));

  it('should save updates to an existing budget entry', async(inject([BudgetService], (budgetService) => {
    mockBackend.connections.subscribe(connection => {
      // make sure the URL is correct
      expect(connection.request.url).toMatch(/3000\/budgets\/2/);
      // is it the correct REST type for an update? (PUT)
      expect(connection.request.method).toBe(RequestMethod.Put);
      connection.mockRespond(new Response(new ResponseOptions({body: { status: 204 }})));
    });

    let budget = new Budget({
      id: 2,
      start_period: '2016-09-24T07:00:00.000Z',
      existing_cash: 22525,
      current_income: 1800,
      budget_items: [
        {
          editing: false,
          item: 'gas',
          projection: 200,
          actual: [
            {
              name: 'Done 10/15',
              amount: 35
            }
          ]
        }
      ]
    });
    budgetService.updateBudgetById(2, budget).subscribe(
      (data) => {
        expect(data).toBeDefined();
        expect(data.status).toBe(204);
      });
  })));

  it('should delete an existing blog entry',
    async(inject([BudgetService], (budgetService) => {
      mockBackend.connections.subscribe(connection => {
        // make sure the URL is correct
        expect(connection.request.url).toMatch(/3000\/budgets\/2/);
        // is it the correct REST type for a delete? (DELETE)
        expect(connection.request.method).toBe(RequestMethod.Delete);
        connection.mockRespond(new Response(new ResponseOptions({body: { status: 204 }})));
      });

      budgetService.deleteBudgetById(2).subscribe(
        (data) => {
          expect(data).toBeDefined();
          expect(data.status).toBe(204);
        },
        (errorResult) => {
          throw (errorResult);
        });
    })));
});
