import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse , HttpResponse} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError,shareReplay ,tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  // user = new BehaviorSubject<any>(null);
   loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router,
              private route : ActivatedRoute) {}


 get isLoggedIn() {
                return this.loggedIn.asObservable();
            }

login(email: string, password: string){
  this.loggedIn.next(true)
    return this.http
      .post(
        'http://localhost:5000/api/users/login',
        {
          email: email,
          password: password,
        
        },{
          observe: 'response'
        }
      ).pipe(
        tap((res : HttpResponse<any>) => {
          console.log(res)
          this.setSession(res.body.token,res.body)
        })
      )
     

}

logout(){
  this.removeSession();
  this.loggedIn.next(false);
  this.router.navigate(['/login'])
}

getAccessToken(){
  return localStorage.getItem('token')
}




private setSession(token : string , body : object)
{
  localStorage.setItem('token',token);
  localStorage.setItem('userData',JSON.stringify(body));
}


private removeSession(){
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
}

}
