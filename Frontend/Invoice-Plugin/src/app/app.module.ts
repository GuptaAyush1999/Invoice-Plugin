import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table'
import {MatButtonModule} from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule} from '@angular/material/menu'
import {MatGridListModule, MatGridTile} from '@angular/material/grid-list'
import {MatPaginatorModule} from '@angular/material/paginator'


import { homeService } from './home/home.service';
import { CreateUserComponent } from './home/create-user/create-user.component';

import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './home/auth/auth.component';
import { AuthService } from './home/auth/auth.service';



import { EditProfileComponent } from './home/edit-profile/edit-profile.component';
import { AuthInterceptorService } from './home/auth/auth-interceptor.service';
import { ManageUsersComponent } from './home/manage-users/manage-users.component';
import { HeaderComponent } from './header/header.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreateInvoiceComponent } from './invoice/create-invoice/create-invoice.component';
import { ManageInvoiceComponent } from './invoice/manage-invoice/manage-invoice.component';
import { EditInvoiceComponent } from './invoice/manage-invoice/edit-invoice/edit-invoice.component';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule } from '@angular/material/checkbox';

import { FooterComponent } from './footer/footer.component';





@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateUserComponent,
    AuthComponent,
    CreateInvoiceComponent,
   
    EditProfileComponent,
   
    ManageUsersComponent,
   
    HeaderComponent,
   
    InvoiceComponent,
   
    ManageInvoiceComponent,
   
    EditInvoiceComponent,
   
  
   
    FooterComponent,
   
  ],
  imports: [
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    
    
    OverlayModule,
    CdkTreeModule,
    PortalModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
   
  ],
  providers: [homeService,AuthService,
  {provide : HTTP_INTERCEPTORS,useClass:AuthInterceptorService,multi:true}
],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
