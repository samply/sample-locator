import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleResultComponent } from './simple-result.component';

describe('SimpleResultComponent', () => {
  let component: SimpleResultComponent;
  let fixture: ComponentFixture<SimpleResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
