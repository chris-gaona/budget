export class Budget {
  id: number;
  start_period: string = '';
  existing_cash: number = 0;
  current_income: number = 0;
  budget_items: BudgetItems[];

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}

class BudgetItems {
  editing: boolean = false;
  item: string = '';
  projection: number;
  actual: ActualItems[];
}

class ActualItems {
  name: string = '';
  amount: number = 0;
}
