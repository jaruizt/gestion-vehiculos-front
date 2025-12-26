import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { FacturaCompraService } from '../../services/factura-compra.service';
import { VehiculoService } from '../../../vehiculos/services/vehiculo.service';
import { ProveedorService } from '../../services/proveedor.service';
import { FacturaCompraResponse, FacturaCompraRequest, VehiculoResponse, ProveedorResponse } from '../../../../core/models';
import { ProveedorFormComponent } from '../proveedor-form/proveedor-form.component';

@Component({
  selector: 'app-factura-compra-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProveedorFormComponent],
  templateUrl: './factura-compra-form.component.html',
  styleUrls: ['./factura-compra-form.component.scss']
})
export class FacturaCompraFormComponent implements OnInit {
  @Input() factura: FacturaCompraResponse | null = null;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  facturaForm: FormGroup;
  loading = false;
  vehiculos: VehiculoResponse[] = [];
  proveedores: ProveedorResponse[] = [];
  mostrarModalProveedor = false;

  constructor(
    private fb: FormBuilder,
    private facturaCompraService: FacturaCompraService,
    private vehiculoService: VehiculoService,
    private proveedorService: ProveedorService,
    private toastr: ToastrService
  ) {
    this.facturaForm = this.fb.group({
      vehiculoId: ['', Validators.required],
      proveedorId: ['', Validators.required],
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
        proveedorId: this.factura.proveedorId,
        numeroFactura: this.factura.numeroFactura,
        fechaFactura: this.factura.fechaFactura,
        importeTotal: this.factura.importeTotal
      });
    }
  }

  cargarDatos(): void {
    forkJoin({
      vehiculos: this.vehiculoService.listarActivos(),
      proveedores: this.proveedorService.listarActivos()
    }).subscribe({
      next: ({ vehiculos, proveedores }) => {
        this.vehiculos = vehiculos;
        this.proveedores = proveedores;
      }
    });
  }

  abrirModalProveedor(): void {
    this.mostrarModalProveedor = true;
  }

  cerrarModalProveedor(): void {
    this.mostrarModalProveedor = false;
  }

  onProveedorGuardado(): void {
    this.cerrarModalProveedor();
    this.proveedorService.listarActivos().subscribe({
      next: (data) => {
        this.proveedores = data;
        if (data.length > 0) {
          this.facturaForm.patchValue({ proveedorId: data[data.length - 1].id });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const facturaData: FacturaCompraRequest = this.facturaForm.value;

    const operacion = this.esEdicion && this.factura
      ? this.facturaCompraService.actualizar(this.factura.id, facturaData)
      : this.facturaCompraService.crear(facturaData);

    operacion.subscribe({
      next: () => {
        this.toastr.success(
          `Factura de compra ${this.esEdicion ? 'actualizada' : 'creada'} correctamente`,
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