import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlRedirectComponent } from './url-redirect.component';

describe('UrlRedirectComponent', () => {
  let component: UrlRedirectComponent;
  let fixture: ComponentFixture<UrlRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UrlRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
