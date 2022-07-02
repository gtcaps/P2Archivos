import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBajaComponent } from './admin-baja.component';

describe('AdminBajaComponent', () => {
  let component: AdminBajaComponent;
  let fixture: ComponentFixture<AdminBajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminBajaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
