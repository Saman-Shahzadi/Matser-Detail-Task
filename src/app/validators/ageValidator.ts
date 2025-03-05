import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { min } from "rxjs";

export function ageValidatorBasedOnGender(genderControlName:string) : ValidatorFn{
    return (control:AbstractControl) : ValidationErrors | null  =>{
        //if(!control.parent) return null;

        
        const genderControl = control.parent?.get(genderControlName);
        if(!genderControl) return null;

        const age = control.value;
        const gender = genderControl.value;
        let minAge = 1;

        if(gender === "Male"){
            minAge = 18;
        }else if(gender === "Female"){
            minAge = 23;
        }else{
            return null;
        }
        console.log("Validator Running: ", age, gender);

        return age < minAge? {minError: `Age should be atleast ${minAge}`} : null;
        
    };

    
}

