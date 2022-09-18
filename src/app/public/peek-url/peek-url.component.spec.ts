import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeekUrlComponent } from './peek-url.component';

describe('PeekUrlComponent', () => {
  let component: PeekUrlComponent;
  let fixture: ComponentFixture<PeekUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeekUrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeekUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
