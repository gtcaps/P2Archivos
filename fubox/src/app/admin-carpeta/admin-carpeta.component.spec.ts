import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCarpetaComponent } from './admin-carpeta.component';

describe('AdminCarpetaComponent', () => {
  let component: AdminCarpetaComponent;
  let fixture: ComponentFixture<AdminCarpetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCarpetaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCarpetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
