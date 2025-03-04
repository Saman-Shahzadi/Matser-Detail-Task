import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDetailCrudComponent } from './master-detail-crud.component';

describe('MasterDetailCrudComponent', () => {
  let component: MasterDetailCrudComponent;
  let fixture: ComponentFixture<MasterDetailCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterDetailCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MasterDetailCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
