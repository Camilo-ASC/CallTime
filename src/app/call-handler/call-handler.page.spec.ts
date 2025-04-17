import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallHandlerPage } from './call-handler.page';

describe('CallHandlerPage', () => {
  let component: CallHandlerPage;
  let fixture: ComponentFixture<CallHandlerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CallHandlerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
