import { NgModule } from '@angular/core';
import { AuthGuard } from './services/auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { IncomingComponent } from './incoming/incoming.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { ApplicationComponent } from './application/application.component';

const routes: Routes = [
  { 
    path: "app", 
    component: ApplicationComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'incoming', component: IncomingComponent },
      { path: 'today', component: IncomingComponent },
      { path: 'upcoming', component: IncomingComponent },
      { path: 'filters', component: IncomingComponent },
      { path: 'done', component: IncomingComponent },
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "**", canActivate: [AuthGuard], redirectTo: "/app/incoming" },
  { path: "**", redirectTo: "/login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
