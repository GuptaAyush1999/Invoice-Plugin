import {HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {User} from './home.interface';


@Injectable()

export class homeService{



    constructor(private http : HttpClient){ 
      
    } 
    getUsers(){
       return this.http.get<User[]>('http://localhost:5000/api/users') 
    
    }

    getUser(id : string){
       return this.http.get(`http://localhost:5000/api/users/${id}`)
    }

    updateUser(name : string, email : string, password :string, isSuperAdmin : boolean,id : string){
      const userData={
          name:name,
          email:email,
          password: password,
          isSuperAdmin:isSuperAdmin
      }
    
      return this.http.put(`http://localhost:5000/api/users/${id}`,userData)
}

    deleteUser(id : string){
      return this.http.delete(`http://localhost:5000/api/users/${id}`)

    }

    registerUser(name : string, email : string, password :string, isSuperAdmin : boolean){
      const userData={
          name:name,
          email:email,
          password: password,
          isSuperAdmin:isSuperAdmin
      }

      return this.http.post('http://localhost:5000/api/users',userData)

    }

    
}