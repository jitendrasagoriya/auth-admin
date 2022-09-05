import { Directive } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordConfirmValidator]'
})
export class PasswordConfirmValidatorDirective implements Validator {

  constructor() { }
  validate(control: AbstractControl): ValidationErrors {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value ? { matched : true } : null;
  }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }

}
