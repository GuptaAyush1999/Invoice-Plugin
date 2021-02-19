import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    ActivatedRoute
  } from '@angular/router';
  import { Injectable } from '@angular/core';
 
  
  import { AuthService } from './auth.service';
  

//   Auth guard - secure internal pages(without logn you can't access)
  @Injectable({ providedIn: 'root' })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
   
   
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if(localStorage.getItem("userData")){
            return true;
        }
        this.router.navigate([''])
        return false;
    }
    }


    // auth guard - redirect to home page if you are logged in and wants to go to tha login page
    @Injectable({ providedIn: 'root' })
    export class AuthGuard2 implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
   
   
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if(localStorage.getItem("userData")){
            this.router.navigate(['/home'])
            return false;
        }
        return true;
    }
    }



    // auth guard - prevent pages of super admin 
    @Injectable({ providedIn: 'root' })
    export class AuthGuard3 implements CanActivate {
      constructor(private authService: AuthService, private router: Router,
                  private route : ActivatedRoute) {}
     
     
      canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
          const userData = JSON.parse(localStorage.getItem("userData"))
          if(userData.isSuperAdmin){
              return true;
          }
          this.router.navigate(['/home'],{relativeTo:this.route})
          return false;
      }
      }

  