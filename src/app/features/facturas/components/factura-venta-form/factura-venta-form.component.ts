import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { FacturaVentaService } from '../../services/factura-venta.service';
import { VehiculoService } from '../../../vehiculos/services/vehiculo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { FacturaVentaResponse, FacturaVentaRequest, VehiculoResponse, ClienteResponse } from '../../../../core/models';

@Component({
  selector: 'app-factura-venta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './factura-venta-form.component.html',
  styleUrls: ['./factura-venta-form.component.scss']
})
export class FacturaVentaFormComponent implements OnInit {
  @Input() factura: FacturaVentaResponse | null = null;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  facturaForm: FormGroup;
  loading = false;
  vehiculos: VehiculoResponse[] = [];
  clientes: ClienteResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaVentaService: FacturaVentaService,
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.facturaForm = this.fb.group({
      vehiculoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      numeroFactura: ['', [Validators.required, Validators.maxLength(50)]],
      fechaFactura: ['', Validators.required],
      importeTotal: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();

    if (this.esEdicion && this.factura) {
      this.facturaForm.patchValue({
        vehiculoId: this.factura.vehiculoId,
        clienteId: this.factura.clienteId,
        numeroFactura: this.factura.numeroFactura,
        fechaFactura: this.factura.fechaFactura,
        importeTotal: this.factura.importeTotal
      });
    }
  }

  cargarDatos(): void {
    forkJoin({
      vehiculos: this.vehiculoService.listarActivos(),
      clientes: this.clienteService.listarActivos()
    }).subscribe({
      next: ({ vehiculos, clientes }) => {
        this.vehiculos = vehiculos;
        this.clientes = clientes;
      }
    });
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const facturaData: FacturaVentaRequest = this.facturaForm.value;

    const operacion = this.esEdicion && this.factura
      ? this.facturaVentaService.actualizar(this.factura.id, facturaData)
      : this.facturaVentaService.crear(facturaData);

    operacion.subscribe({
      next: () => {
        this.toastr.success(
          `Factura de venta ${this.esEdicion ? 'actualizada' : 'creada'} correctamente`,
          '¡Éxito!'
        );
        this.guardado.emit();
      },
      error: () => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.facturaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}