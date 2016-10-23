import { BudgetPage } from './app.po';

describe('budget App', function() {
  let page: BudgetPage;

  beforeEach(() => {
    page = new BudgetPage();
  });

  it('should display message saying Budget Tracker', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Budget Tracker');
  });
});
