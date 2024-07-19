
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule, NgbDatepickerModule, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ITodoStatus, ITodoPriority, TodoCardComponent} from '../../shared/components/todo-card/todo-card.component';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import { JsonPipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { environment } from '../../../environments/environment';

interface Task {
  _id: number;
  userId: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

interface UserInfoResponse {
  userId: number; // Adjust the type based on your backend response
  message: string;
}
export function onSortChange(event: Event): string {
  const target = event.target as HTMLSelectElement;
  const sortBy = target.value;
  return sortBy;
}
@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCardComponent, SlidePanelComponent, ReactiveFormsModule, NgbDatepickerModule, NgbAlertModule, JsonPipe],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  BASE_URL='https://taskcanvasbackend.onrender.com';
  model: NgbDateStruct;
  tasks: Task[] = [];
  todoStatus = ITodoStatus;
  todoPriority = ITodoPriority;
  userId: number | null = null; // Initialize userId
  userInfoMessage: string | null = null;
  statusOrder: string[] = ['DONE', 'PROGRESS', 'NOT COMPLETED'];
  priorityOrder: string[] = ['LOW', 'MEDIUM', 'HIGHEST'];
  isSlidePanelOpen = false;
  
  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private router: Router, 
    private cookieService: CookieService, 
    private location: Location, 
    private cdr: ChangeDetectorRef
  ) {}
  // sort-utils.ts



  ngOnInit(): void {
    this.todoForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      priority: ["", Validators.required],
      date: ["", Validators.required],
    });
    this.fetchTasks(); // Fetch tasks on component initialization
    this.fetchUserInfo(); // Fetch user info on component initialization
  }
  
  getUserIdFromCookie(): string | null {
    return this.cookieService.get(`userId`); // Adjust 'userId' to your actual cookie name
  }
 
  fetchUserInfo(): void {
    this.http.post<UserInfoResponse>(`${this.BASE_URL}/userInfo`, {}, {
      withCredentials: true // Ensure cookies are sent with the request
    }).subscribe(
      (response) => {
        this.userId = response.userId;
        this.userInfoMessage = response.message;
        console.log('User ID:', this.userId);
      },
      (error) => {
        console.error('Error fetching user info:', error);
        Swal.fire('Error', 'Failed to fetch user info', 'error');
      }
    );
  }

  fetchTasks(): void {
    this.http.get<{ message: string, tasks: Task[] }>(`${this.BASE_URL}/tasks`, {
      withCredentials: true // Ensure cookies are sent with the request
    }).subscribe(
      (response) => {
        this.tasks = response.tasks;
      },
      (error) => {
        console.error('Error fetching tasks:', error);
        Swal.fire('Error', 'Failed to fetch tasks', 'error');
      }
    );
  }

  openSlidePanel(): void {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel(): void {
    this.isSlidePanelOpen = false;
  }

 

  exportCSV() {
    this.fetchTasks();
    const options = {
      title: 'Task Details',
      fieldSeparator: ",",
      qouteString: '"',
      decimalseparator: ".",
      showLabels: false,
      noDownload: false,
      showTitle: false,
      useBom: false,
      headers: ['_id', 'userId', 'title', 'description', 'status', 'priority', 'date']
    }
    new ngxCsv(this.tasks, "report", options);
  }

  onSubmit(): void {
    const task = this.todoForm.getRawValue();

    if (!this.userId) {
      this.fetchUserInfo();
    }

    if (!this.todoForm.valid) {
      Swal.fire("Please enter all the fields");
      return;
    }

    this.http.post(`${this.BASE_URL}/task/${this.userId}`, task, {
      withCredentials: true // Send cookies with the request
    }).subscribe(
      () => {
        this.isSlidePanelOpen = false;
        Swal.fire("Success", "Task added successfully", "success").then(() => {
          window.location.reload();
        });
      },
      (err) => {
        console.error('Error adding task:', err); // Log the error for debugging
        Swal.fire("Error", err.error.message || "Failed to add task", "error");
      }
    );
  }
  
}
