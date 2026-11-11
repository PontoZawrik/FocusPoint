import { Component } from '@angular/core';

interface Input {
  name: string,
  placeholder: string,
  type: string,
  isActive: boolean,
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  inputs: Input[] = [
    {
      name: "Email",
      placeholder: "Введите Email-адрес...",
      type: "email",
      isActive: false
    },
    {
      name: "Пароль",
      placeholder: "Введите пароль...",
      type: "password",
      isActive: false
    },
  ]

  focus(index: number): void {
    this.inputs[index].isActive = true
  }

  blur(index: number): void {
    this.inputs[index].isActive = false
  }
}
