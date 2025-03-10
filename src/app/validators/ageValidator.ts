import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { differenceInYears } from 'date-fns';

export function ageValidatorBasedOnGender(genderControlName:string) : ValidatorFn{
    return (control:AbstractControl) : ValidationErrors | null  =>{
    
        const genderControl = control.parent?.get(genderControlName);
        if(!genderControl) return null;

        const dob = new Date(control.value);    
        const todayDate = new Date();            
        const age = Math.abs(differenceInYears(dob, todayDate));    

        const gender = genderControl.value;
        let minAge = 1;
        let maxAge = 100;

        if(gender === "Male"){
            minAge = 18;
        }else if(gender === "Female"){
            minAge = 23;
        }else if(gender === "Other"){
            minAge = 1;
        }
        else{
            return null;
        }
        console.log("Validator Running: ", age, gender);

        if(age < minAge){
            return  {minError: `Age should be atleast ${minAge}`};
        }
        else if(age > maxAge){
            return  {maxError: `Age cannot be more than ${maxAge} ` };
        }
        else{
            return null;
        }
        
    };

    
}

