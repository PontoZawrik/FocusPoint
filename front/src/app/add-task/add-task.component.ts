import { Component, EventEmitter, Output } from '@angular/core';
import { Task } from '../services/application.service';

interface Settings {
  period: boolean,
  priority: boolean,
  tags: boolean,
}

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  @Output() addEvent = new EventEmitter<Task>()

  title: string = ""
  description: string = ""
  activePriority: number = 4
  tags: string[] = []

  addTask() {
    if (this.title) {
      this.addEvent.emit({
        name: this.title, 
        description: this.description,
        priority: this.activePriority,
        tags: this.tags,
      })
    }

    this.disableEditor()
  }


  isActive: boolean = false
  priorities: boolean[] = [
    false,
    false,
    false,
    true,
  ]
  settings: Settings = {
    period: false,
    priority: false,
    tags: false,
  }
  newTag: string = ""

  toggleSetting(setting: string): void {
    if (setting == "period" || setting == "priority" || setting == "tags") {
      let isActive: boolean = this.settings[setting] == true

      this.settings = {
        period: false,
        priority: false,
        tags: false,
      }
      
      if (!isActive)
        this.settings[setting] = true
    }
  }

  changePrior(index: number): void {
    this.priorities.fill(false)
    this.priorities[index] = true
    this.activePriority = index+1
    this.settings.priority = false
  }

  priority(): string {
    if (this.activePriority != 4) {
      return `P${this.activePriority}`
    }
    return "Приоритет"
  }

  activeEditor(): void {
    this.isActive = true
  }

  disableEditor(): void {
    this.isActive = false

    this.title = ""
    this.description = ""
    this.activePriority = 4
    this.tags = []

    this.priorities = [
      false,
      false,
      false,
      true,
    ]
    this.settings = {
      period: false,
      priority: false,
      tags: false,
    }
    this.newTag = ""
  }

  createTag(): void {
    this.tags.push(this.newTag)
    this.newTag = ""
  }

  deleteTag(deleteTag: string): void {
    this.tags = this.tags.filter((tag) => tag !== deleteTag)
  }
}
