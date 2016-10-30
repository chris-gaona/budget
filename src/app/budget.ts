export class Budget {
  id: number;
  start_period: any = new Date();
  existing_cash: number = 0;
  current_income: number = 0;
  budget_items: any = [new BudgetItems()];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class BudgetItems {
  editing: boolean = false;
  item: string = '';
  projection: number = 0;
  actual: any = [new ActualItems()];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

export class ActualItems {
  name: string = '';
  amount: number = 0;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
