import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';

import { AuthComponent } from './home/auth/auth.component';
import { AuthGuard, AuthGuard2, AuthGuard3 } from './home/auth/auth.guard';
import { CreateUserComponent } from './home/create-user/create-user.component';
import { EditProfileComponent } from './home/edit-profile/edit-profile.component';
import { HomeComponent } from './home/home.component';
import { ManageUsersComponent } from './home/manage-users/manage-users.component';
import { ManageInvoiceComponent } from './invoice/manage-invoice/manage-invoice.component';
import { EditInvoiceComponent } from './invoice/manage-invoice/edit-invoice/edit-invoice.component';


const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full'},
  {path:'login',component:AuthComponent, canActivate:[AuthGuard2]},
  {path:'home',component:HomeComponent, canActivate:[AuthGuard] },
  {path:'users',component:ManageUsersComponent,canActivate:[AuthGuard,AuthGuard3]},
  {path:'register',component:CreateUserComponent, canActivate:[AuthGuard,AuthGuard3] },
  {path:':id/editProfile',component:EditProfileComponent , canActivate:[AuthGuard,AuthGuard3]},
  {path:':id/invoice',component:CreateInvoiceComponent , canActivate:[AuthGuard]},
  {path:':id/manageinvoice',component:ManageInvoiceComponent , canActivate:[AuthGuard]},
  {path:'editinvoice/:id',component:EditInvoiceComponent , canActivate:[AuthGuard]},
 
  
  // {path: '**', redirectTo:'/login' , pathMatch:'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
