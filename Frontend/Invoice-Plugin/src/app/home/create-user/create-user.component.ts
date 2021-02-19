
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../home.interface';
import { homeService } from '../home.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export  class CreateUserComponent implements OnInit {
  Roles: any[] = ['Super Admin', 'Sales Team'];
  isSuperAdmin=false;
  

  signupForm : FormGroup =new FormGroup({
      
    'name' : new FormControl(null,[Validators.required]),
    'email' : new FormControl(null,[Validators.required,Validators.email]),
    'password' : new FormControl(null,[Validators.required]),
    'status' : new FormControl(null,[Validators.required]),
   
 
})

constructor(private http: HttpClient,
            private homeService : homeService,
            private route : ActivatedRoute,
            private router : Router,
            private toastr: ToastrService) { }

 // Choose role using select dropdown

  ngOnInit(){
    console.log(this.route.snapshot.paramMap.get('id'));
    document.body.className = "selector";
  }

  
  ngOnDestroy(){
    document.body.className="";
  }
  

  onManageUsers(id : string){
     
  }

  onSubmit(){

  console.log(this.signupForm)

   if(this.signupForm.value.status==="Super Admin"){
     this.isSuperAdmin=true
   }
   console.log(this.isSuperAdmin)

    let email = this.signupForm.value.email;
    let name = this.signupForm.value.name;
    let password = this.signupForm.value.password;
    this.homeService.registerUser(name,email,password,this.isSuperAdmin).subscribe(data => {
      console.log(data);
      this.toastr.success("You Have Successfully Created A New User!!!")
      this.router.navigate(['/users'],{relativeTo:this.route})
    },error => {
      this.toastr.error("User Data Is Invalid !!!")
     
    })

    
    this.isSuperAdmin=false
    this.signupForm.reset()
  }

}