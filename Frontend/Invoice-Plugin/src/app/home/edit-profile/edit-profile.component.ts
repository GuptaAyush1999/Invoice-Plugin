import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { homeService } from '../home.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  Roles: any[] = ['Super Admin', 'Sales Team'];
  isSuperAdmin=false;
  id : any;
  userData : any ;
  userStatus = 'Sales Team'


  editForm : FormGroup =new FormGroup({
      
    'name' : new FormControl(null,[Validators.required]),
    'email' : new FormControl(null,[Validators.required,Validators.email]),
    'password' : new FormControl(null,[Validators.required]),
    'status' : new FormControl(null,[Validators.required]),
   
 
})

  constructor(private route : ActivatedRoute,
              private router : Router,
              private homeService : homeService,
              private toastr: ToastrService) {
                
               }

  ngOnInit(): void {
    this.route.params.subscribe((Params:Params) => {
      console.log("id is "+Params['id'])
      this.id=Params['id']
      document.body.className = "selector";

      this.homeService.getUser(this.id).subscribe(res => {
        console.log(res)
        this.userData=res;
        if(this.userData.isSuperAdmin){
           this.userStatus='Super Admin'
        }

        this.editForm.patchValue({
          name: this.userData.name,
          email : this.userData.email,
          status : this.userStatus
        })

      })
     
})
  
 }
 ngOnDestroy(){
  document.body.className="";
}


  onGoBack(){
    this.router.navigate([`/users`],{relativeTo:this.route})

  }


  onSubmit(){
    
   if(this.editForm.value.status==="Super Admin"){
    this.isSuperAdmin=true
  }
  console.log(this.isSuperAdmin)

   let email = this.editForm.value.email;
   let name = this.editForm.value.name;
   let password = this.editForm.value.password;
   this.homeService.updateUser(name,email,password,this.isSuperAdmin,this.id).subscribe(data => {
     console.log(data);
     this.toastr.success('Successfully Updated!!!');
     this.router.navigate(['/users'],{relativeTo:this.route})
   },error => {
    this.toastr.error('User Not Found!!!');
   })

   
   this.isSuperAdmin=false
   this.editForm.reset()

  }

}
