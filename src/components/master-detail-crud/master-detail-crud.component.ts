import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import {ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DatePicker } from 'primeng/datepicker';
import { ageValidatorBasedOnGender } from '../../app/validators/ageValidator';

@Component({
  selector: 'app-master-detail-crud',
  templateUrl: './master-detail-crud.component.html',
  styleUrls: ['./master-detail-crud.component.scss'],
  imports: [ButtonModule, CommonModule, DialogModule,
    ReactiveFormsModule, TableModule,
    InputGroupModule, InputGroupAddonModule,
    InputTextModule, NgFor, Toast, ConfirmDialogModule,
    RadioButtonModule, DatePicker],
    providers: [ConfirmationService, MessageService]
})
export class MasterDetailCrudComponent implements OnInit {

  departmentForm! : FormGroup;
  departmentData : any[] = [];
  visible : boolean = false;
  deptEditIndex : number | null = null;
  empEditIndex : number | null = null;
  isEditingEmployee : boolean =  false;

 
  

  constructor(private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService){}

  ngOnInit(){
    
    this.initializeForm();
    this.loadDataFromLocalStorage();
  }

  initializeForm(){
    this.departmentForm = this.fb.group({
      departmentName : ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$'), Validators.minLength(2), Validators.maxLength(20)]],
      employees : this.fb.array([this.newEmployee()])
    });
  }
  
 addDepartment(){
  this.departmentForm = this.fb.group({
    departmentName : ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),  Validators.minLength(2), Validators.maxLength(20)]],
    employees : this.fb.array([this.newEmployee()])
  });
  this.showDialog();
 }

  

  Employees(): FormArray {
    return this.departmentForm.get('employees') as FormArray;
  }
 
  newEmployee(){
       return this.fb.group({
      employeeName : ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$'),  Validators.minLength(3), Validators.maxLength(20)]],
      employeeCNIC: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      employeeJob  : ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      employeeGender : ['', Validators.required],
      employeeDOB : ['1', [Validators.required, ageValidatorBasedOnGender("employeeGender") ]],
      employeeSalary : ['']
      
    });
  }

  addNewEmployee(){ 
    this.Employees().push(this.newEmployee());
  }

// removing from form
  removeEmployee(empIndex:number){
    if(this.Employees().length > 1){
      this.Employees().removeAt(empIndex);
    }
    else{
      this.showSingleEmployeeDeletionMessage();
    }
  }

// deleting from department data (table)
  deleteEmployee(deptIndex:number, empIndex:number){

    this.departmentData[deptIndex].employees.splice(empIndex, 1);
  }

  onFormSubmit(){
    this.departmentData = this.departmentForm.value;
    console.log(this.departmentForm.value); 
  }


  // dialog related function
  showDialog(){
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;   
    
    // resetting editing related flags
    this.deptEditIndex = null;
    this.empEditIndex = null;
    this.isEditingEmployee = false;
  
    // form reset
    this.Formreset();
  }
  
  

  editDepartment(deptIndex:number){
    this.Formreset();
    this.deptEditIndex = deptIndex;
    const selectedDepartment = this.departmentData[deptIndex];

    
    this.departmentForm.patchValue({
      departmentName : selectedDepartment.departmentName
    });

    this.Employees().clear();

    selectedDepartment.employees.forEach((emp: any) => {
      this.Employees().push(this.fb.group(emp)); 
    });
    this.showDialog();

  }
  
  Formreset(){
    this.departmentForm.reset();
    this.Employees().clear();
    this.Employees().push(this.newEmployee());
  }

  deleteDepartment(deptIndex:number){
    this.departmentData.splice(deptIndex, 1);
  }


  

  editEmployee(deptIndex: number, empIndex: number) {
    this.deptEditIndex = deptIndex; 
    this.empEditIndex = empIndex;   
    this.isEditingEmployee = true;    

    this.departmentForm.patchValue({
      departmentName : this.departmentData[deptIndex].departmentName
    });
    
    const selectedEmployee = this.departmentData[deptIndex].employees[empIndex];
  
    
    this.departmentForm.patchValue({
      employees: [{
        employeeName: selectedEmployee.employeeName,
        employeeCNIC: selectedEmployee.employeeCNIC,
        employeeJob: selectedEmployee.employeeJob,
        employeeGender : selectedEmployee.employeeGender,
        employeeDOB : selectedEmployee.employeeDOB,
        employeeSalary : selectedEmployee.employeeSalary

      }]
    });
  
    this.showDialog();
  }

  saveDepartment() {
    if(this.departmentForm.valid){
      
    const selectedDepartment = this.departmentForm.value;
  
    if (this.deptEditIndex === null) {
      // Adding new department
      this.departmentData.push(selectedDepartment);
      this.showSuccessMessage();    // message 
      
     
    } else {
      if (this.empEditIndex === null) {
        // Editing a department 
        this.departmentData[this.deptEditIndex] = selectedDepartment;
        this.showUpdateDepartmentMessage();
           
      } else {
        // Editing a specific employee inside the department
        this.departmentData[this.deptEditIndex].employees[this.empEditIndex] = selectedDepartment.employees[0];
        this.showUpdateEmployeeMessage();

        // Reset employee edit index
        this.empEditIndex = null;
        this.isEditingEmployee = false;
      }
  
      this.deptEditIndex = null;
    }
    this.saveToLocalStorage();
    this.Formreset();
    this.closeDialog();
  }else{
    this.departmentForm.markAllAsTouched();
    this.showInvalidMessage();
  }
  
}

// Messages

showSuccessMessage() {
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department has been added successfully' });
}

showUpdateDepartmentMessage() {
  this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Department has been updated successfully' });
}

showUpdateEmployeeMessage() {
  this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Employee has been updated successfully' });
}

showInvalidMessage() {
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Submission: Kindly fill out all fields correctly!!!' });
}

showSingleEmployeeDeletionMessage() {
  this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Department must contain atleast one employee' });
}


showLocalStorageSaveSuccessMessage() {
  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Changes saved to local storage' });
}


confirmDeleteDepartment(event: Event, deptIndex:number) {
  this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Department?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },

      accept: () => {
          this.deleteDepartment(deptIndex);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Department Record deleted' });
          this.saveToLocalStorage();
        },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
  });
}
  
confirmDeleteEmployee(event: Event, deptIndex:number, empIndex:number) {
  this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this Employee?',
      header: 'Danger Zone',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancel',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },

      accept: () => {
          if(this.departmentData[deptIndex].employees.length > 1){
          this.deleteEmployee(deptIndex, empIndex);
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Employee Record deleted' });
          this.saveToLocalStorage();  
        }
          else{
            this.showSingleEmployeeDeletionMessage();
          }
        },
      reject: () => {
          this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
      },
  });
}

//local storage functions
saveToLocalStorage(){
  localStorage.setItem('departments', JSON.stringify(this.departmentData));
  this.showLocalStorageSaveSuccessMessage();
}

loadDataFromLocalStorage(){
  const data = localStorage.getItem('departments');
  if(data){
    this.departmentData = JSON.parse(data);
  }
  
}
isEmployeeRecordAdded(){
  return this.Employees().controls.every(emp => emp.dirty && emp.valid);
}

/// conditional validation using custom validator






}



