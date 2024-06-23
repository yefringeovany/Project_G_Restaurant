import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CocinaComponent } from './cocina.component';

describe('CocinaComponent', () => {
  let component: CocinaComponent;
  let fixture: ComponentFixture<CocinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CocinaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CocinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
