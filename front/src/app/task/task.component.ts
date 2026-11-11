import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../services/application.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  @Input() task?: Task

  @Output() deleteEvent = new EventEmitter<number>()

  deleteTask() {
    this.deleteEvent.emit(this.task?.id)
  }
  
}
