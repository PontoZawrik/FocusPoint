import { Injectable } from '@angular/core';
import axiosInstance from './axisConfig';

export interface Task {
  id?: number,
  name: string,
  description: string,
  priority: number,
  tags: string[]
}

export interface User {
  username: string,
  tasks: Task[]
}

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  user: User = this.createEmptyUser()
  constructor() {}

  async getUserData(): Promise<void> {
    try {
      const response = await axiosInstance.get<User>('/api/task/get-user-data')
      this.user = response.data
      console.log(this.user)
    } 
    catch (error) {
      console.error('Error fetching user:', error)
      this.user = this.createEmptyUser()
      throw error
    }
  }

  async addProduct(taskData: Task): Promise<void> {
    const { id, ...newTaskData } = taskData
    const taskToAdd: Task = { ...newTaskData }
    try {
      await axiosInstance.post<void>(
        '/api/task/add',
        newTaskData
      )
    } 
    catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }

  async deleteTask(id: number): Promise<void> {
    if (id === undefined) {
      console.error('Cannot delete product without ID');
      return
    }

    try {
      await axiosInstance.delete<any>(`/api/task/${id}`)
    } 
    catch (error) {
      console.error(`Error deleting product with id ${id}:`, error)
      throw error
    }
  }

  createEmptyUser(): User {
    return {
      username: "",
      tasks: []
    }
  }
}
