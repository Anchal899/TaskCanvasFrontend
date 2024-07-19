import { Component, OnInit, ChangeDetectorRef ,ChangeDetectionStrategy} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { TodoComponent ,onSortChange} from '../../../pages/todo/todo.component';
import { environment } from '../../../../environments/environment';
export type ITodoType = 'NOT COMPLETED' | 'PROGRESS' | 'DONE';
export const ITodoStatus = ['NOT COMPLETED', 'PROGRESS', 'DONE'];
export const ITodoPriority = ['LOW', 'MEDIUM', 'HIGHEST'];

interface Task {
  _id:number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  history: {
    timestamp: Date;
    action: 'created' | 'updated' | 'status_changed';
    details: string;
  }[];
}

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-card.component.html',
  styleUrls: ['./todo-card.component.css'],
  
})
export class TodoCardComponent implements OnInit {
  BASE_URL=environment.BASE_URL;
  tasks: Task[] = [];
  taskId: number | null = null;
  statusOrder: string[] = ['DONE', 'PROGRESS', 'NOT COMPLETED'];
  priorityOrder: string[] = ['LOW', 'MEDIUM', 'HIGHEST'];
  
  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchTasks();
  }
  
  deleteTask(id:number){
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.BASE_URL}/tasks/${id}`, {
          withCredentials: true
        }).subscribe(
          (response) => {
            this.tasks = this.tasks.filter(task => task._id !== id);
            Swal.fire('Deleted!', 'The task has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting task:', error);
            Swal.fire('Error', 'Failed to delete the task', 'error');
          }
        );
      }
    });

  }
  updateTask(task: Task): void {
    Swal.fire({
      title: 'Update Task',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Title" value="${task.title}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Description" value="${task.description}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Status" value="${task.status}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Priority" value="${task.priority}">` +
        `<input id="swal-input5" class="swal2-input" placeholder="Date" value="${task.due_date}">`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: (document.getElementById('swal-input1') as HTMLInputElement).value,
          description: (document.getElementById('swal-input2') as HTMLInputElement).value,
          status: (document.getElementById('swal-input3') as HTMLInputElement).value,
          priority: (document.getElementById('swal-input4') as HTMLInputElement).value,
          date: (document.getElementById('swal-input5') as HTMLInputElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTask = result.value;
        this.http.put(`${this.BASE_URL}/tasks/${task._id}`, updatedTask, {
          withCredentials: true
        }).subscribe(
          (response) => {
            const index = this.tasks.findIndex(t => t._id === task._id);
            if (index !== -1) {
              this.tasks[index] = { ...task, ...updatedTask };
            }
            Swal.fire('Updated!', 'The task has been updated.', 'success');
            console.log(this.tasks);
          },
          (error) => {
            console.error('Error updating task:', error);
            Swal.fire('Error', 'Failed to update the task', 'error');
          }
        );
      }
    });
  }
  onSortChange(event: Event): void {
    const sortBy = onSortChange(event);

    if (sortBy === 'date') {
      this.sortByDate();
    } else if (sortBy === 'status') {
      this.sortByStatus();
    } else if (sortBy === 'priority') {
      this.sortByPriority();
    }
    
  }

  sortByDate(): void {
    let newTask=this.tasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
    this.tasks =newTask;
    console.log(newTask); 
  this.cdr.detectChanges();
  }

  sortByStatus(): void {
    
      let newTask=this.tasks.sort((a, b) => this.statusOrder.indexOf(a.status) - this.statusOrder.indexOf(b.status));
      this.tasks =newTask;
      console.log(newTask); 
    this.cdr.detectChanges();
    
  }

  sortByPriority(): void {
    let newTask=this.tasks.sort((a, b) => this.priorityOrder.indexOf(a.priority) - this.priorityOrder.indexOf(b.priority));
    
    this.tasks =newTask; 
    console.log(newTask);
    this.cdr.detectChanges();
  }

  fetchTasks(): void {
    this.http.get<{ message: string, tasks: Task[],id:number }>(`${this.BASE_URL}/tasks`, {
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
  
}
