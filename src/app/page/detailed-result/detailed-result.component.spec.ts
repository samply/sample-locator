import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedResultComponent } from './detailed-result.component';

describe('DetailedResultComponent', () => {
  let component: DetailedResultComponent;
  let fixture: ComponentFixture<DetailedResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
