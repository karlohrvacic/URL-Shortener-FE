import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitLimitComponent } from './edit-visit-limit.component';

describe('EditVisitLimitComponent', () => {
  let component: EditVisitLimitComponent;
  let fixture: ComponentFixture<EditVisitLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVisitLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
