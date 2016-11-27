import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AppComponent } from './app.component';
import { JumbotronComponent } from './jumbotron/jumbotron.component';
import { HeaderComponent } from './header/header.component';
import { OverviewComponent } from './overview/overview.component';
import { ResultsComponent } from './results/results.component';
import { ModalComponent } from './modal/modal.component';
import { BudgetService } from './budget.service';
import { UserService } from './user.service';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';

let options: ToastOptions = new ToastOptions({
  animate: 'flyRight',
  positionClass: 'toast-bottom-right',
});

@NgModule({
  declarations: [
    AppComponent,
    JumbotronComponent,
    HeaderComponent,
    OverviewComponent,
    ResultsComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot(options)
  ],
  providers: [ BudgetService, UserService, AUTH_PROVIDERS],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
