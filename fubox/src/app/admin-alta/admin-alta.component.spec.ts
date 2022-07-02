import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAltaComponent } from './admin-alta.component';

describe('AdminAltaComponent', () => {
  let component: AdminAltaComponent;
  let fixture: ComponentFixture<AdminAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAltaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
