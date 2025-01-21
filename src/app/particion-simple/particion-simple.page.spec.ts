import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticionSimplePage } from './particion-simple.page';

describe('ParticionSimplePage', () => {
  let component: ParticionSimplePage;
  let fixture: ComponentFixture<ParticionSimplePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticionSimplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
