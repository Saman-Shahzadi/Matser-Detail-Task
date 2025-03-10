import { AbstractControl, ValidationErrors, ValidatorFn, FormArray } from "@angular/forms";
import { findIndex } from "rxjs";

export function uniqueCNICValidator(getFormArray: () => FormArray): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !getFormArray()) {
      return null;
    }

    const formArray = getFormArray();
    const currentValue = control.value;

    const duplicateIndex = formArray.controls.findIndex(
      (group) => group.get('employeeCNIC')?.value === currentValue
    );

    
    if (duplicateIndex !== -1 && formArray.controls[duplicateIndex] !== control.parent) {
      return { uniqueError: `CNIC is duplicated. Value exists at employee record # ${duplicateIndex + 1}` };
    }

    return null;
  };
}
