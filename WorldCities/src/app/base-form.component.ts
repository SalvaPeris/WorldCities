import { Component } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  template: ``
})
export class BaseFormComponent {

  constructor() { }

  getErrors(control: AbstractControl, displayName: string): string[] {
    var errors: string[] = [];
    Object.keys(control.errors || {}).forEach((key) => {
        switch (key) {
        case 'required':
          errors.push(displayName + ' es requerido.');
          break;
        case 'pattern':
          errors.push(displayName + ' contiene caracteres inválidos.');
          break;
        case 'isDupeField':
          errors.push(displayName + ' ya existe.');
          break;
        default:
          errors.push(displayName + ' es inválido.');
          break;
      }
    });

    return errors;
  }
}
