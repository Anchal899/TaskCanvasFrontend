
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from'sweetalert2';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})


export class RegisterComponent implements OnInit{
  registerForm: FormGroup;
  BASE_URL=environment.BASE_URL;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    
  }
  ngOnInit():void {
    this.registerForm=this.fb.group({
      username: "",
      email: "",
      password: "",
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
   let user=this.registerForm.getRawValue();
   console.log(user);
   if(user.username==""||user.email==""||user.password==""){
    Swal.fire("Please enter all the fields");
   }
   else if(!this.validateEmail(user.email)){
    Swal.fire("Error","Please enter a valid email");
   }
   else{
    this.http.post(`${this.BASE_URL}/register`,user,{
      withCredentials:true     //to send jwt automatically to cookies
    }).subscribe(()=>{
      Swal.fire("Success","You have successfully registered");
      this.router.navigate(['login'])
    },(err)=>{
      Swal.fire("Error",err.error.message,"error");
    })
   }
  }
  Gologin(): void {
    
    this.router.navigate(['/login']);
  }
}
