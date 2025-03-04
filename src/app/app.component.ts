import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MasterDetailCrudComponent } from "../components/master-detail-crud/master-detail-crud.component";


@Component({
  selector: 'app-root',
  imports: [MasterDetailCrudComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'task';
}
