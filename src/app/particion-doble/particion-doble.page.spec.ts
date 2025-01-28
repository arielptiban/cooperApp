import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ParticionDoblePage } from './particion-doble.page';

describe('ParticionDoblePage', () => {
  let component: ParticionDoblePage;
  let fixture: ComponentFixture<ParticionDoblePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticionDoblePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
