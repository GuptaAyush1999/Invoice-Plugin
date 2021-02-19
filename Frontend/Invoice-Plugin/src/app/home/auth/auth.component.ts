import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
 import { FormControl, FormGroup, Validators } from '@angular/forms';


import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {


  constructor(private authService: AuthService, private router: Router,
              private route : ActivatedRoute,
              private toastr: ToastrService) {}


    loginForm : FormGroup =new FormGroup({
      
    'email' : new FormControl(null,[Validators.required,Validators.email]),
    'password' : new FormControl(null,[Validators.required])
   
})

ngOnInit() {
  document.body.className = "selector";
}

ngOnDestroy(){
  document.body.className="";
}


  onSubmit() {
   
    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    
    let authObs: Observable<any>;
      
      authObs = this.authService.login(email, password);
      authObs.subscribe(
        resData => {
          const id=resData._id;
          
          this.router.navigate([`/home`],{relativeTo: this.route});
          this.toastr.success('welcome again!!!');
        },
        errorMessage => {
          console.log(errorMessage);
          // this.error = errorMessage.statusText;
          this.toastr.error(errorMessage.statusText);
         
        }
      );
  
    this.loginForm.reset();
  }
}



