import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators,FormControl, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment'
import Swal from 'sweetalert2'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm:FormGroup;
  BASE_URL=environment.BASE_URL;
  constructor(private fb:FormBuilder,private http:HttpClient,private router:Router) {
    
  }
  ngOnInit() {
    this.loginForm=this.fb.group({
      email:"",
      password:""
    });
  }
  validateEmail=(email:any)=>{
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(email.match(validRegex)){
      return true;
    }
    else{
      return false;
    }

  }
  onSubmit():void {
   let user=this.loginForm.getRawValue();
   console.log(user);
   if(user.email==""||user.password==""){
    Swal.fire("Please enter all the fields");
   }
   else if(!this.validateEmail(user.email)){
    Swal.fire("Error","Please enter a valid email");
   }
   else{
    this.http.post('https://taskcanvasbackend.onrender.com/login',user,{
      withCredentials:true     //to send jwt automatically to cookies
    }).subscribe(()=>this.router.navigate(['todo']),(err)=>{
      Swal.fire("Error",err.error.message,"error");
    })
   }
  }
  Goregister(): void {
    
    this.router.navigate(['/']);
  }
}
