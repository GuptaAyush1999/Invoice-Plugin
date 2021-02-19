import { Component, OnInit, ɵɵNgOnChangesFeature } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../home/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSuperAdmin = false;
  isLoggedIn=false;
  id : any;
  isLoggedIn$: Observable<boolean>;

  constructor( private router : Router,
    private route : ActivatedRoute,
  
    private authService : AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    if(localStorage.getItem('userData')){
      this.isLoggedIn=true;
      let userData= JSON.parse(localStorage.getItem('userData'))
  
      this.isSuperAdmin = userData.isSuperAdmin;
      this.id=userData._id;
    }
  }

  onCreateInvoice(){
    console.log(this.id)
    this.router.navigate([`/${this.id}/invoice`],{relativeTo:this.route})
  
  }
  onManageInvoice(){
   
    this.router.navigate([`/${this.id}/manageinvoice`],{relativeTo:this.route})
  
  }
  
  onLogout(){
    this.authService.logout()
  }
  
  
    onCreateUser(){
      this.router.navigate([`/register`],{relativeTo:this.route})
    }
  
    onManageUser(){
      this.router.navigate([`/users`],{relativeTo:this.route})
    }
  
  } 

