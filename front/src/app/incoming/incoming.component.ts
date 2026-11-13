import { Component } from '@angular/core';
import { ApplicationService } from '../services/application.service';
import { Task } from "../services/application.service"

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrl: './incoming.component.css'
})
export class IncomingComponent {
  constructor(private applicationService: ApplicationService) {}
  data: Task[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    await this.applicationService.getUserData();
    this.data = this.applicationService.user.tasks;
  }

  async addTask(taskData: Task): Promise<void>{
    await this.applicationService.addTask(taskData);
    await this.loadData();
  }

  async deleteTask(id: number): Promise<void> {
    await this.applicationService.deleteTask(id);
    await this.loadData();
  }
}
