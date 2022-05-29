import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyDetailsComponent } from './api-key-details.component';

describe('ApiKeyDetailsComponent', () => {
  let component: ApiKeyDetailsComponent;
  let fixture: ComponentFixture<ApiKeyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiKeyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiKeyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
