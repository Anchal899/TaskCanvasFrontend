import { Routes } from '@angular/router';
import { DefaultComponent } from './shared/layouts/default/default.component';
import { LoginComponent } from './pages/login/login.component';
import { TodoComponent } from './pages/todo/todo.component';
import { MasterComponent } from './shared/layouts/master/master.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
    {
        path:'',
        component:DefaultComponent,
        children:[{path:'',component:RegisterComponent}],
    },
    {
        path:'',
        component:DefaultComponent,
        children:[{path:'login',component:LoginComponent}],
    },
   
    {
        path:'',
        component:MasterComponent,
        children:[{path:'todo',component:TodoComponent}],
    }
];
