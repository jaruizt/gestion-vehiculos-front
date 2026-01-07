import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaVentaFormComponent } from './reserva-venta-form.component';

describe('ReservaVentaFormComponent', () => {
  let component: ReservaVentaFormComponent;
  let fixture: ComponentFixture<ReservaVentaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservaVentaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaVentaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
