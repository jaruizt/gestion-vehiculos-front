import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VehiculoService } from '../../services/vehiculo.service';
import { VehiculoResponse, VehiculoRequest } from '../../../../core/models';

@Component({
  selector: 'app-vehiculo-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehiculo-form.component.html',
  styleUrls: ['./vehiculo-form.component.scss']
})
export class VehiculoFormComponent implements OnInit {
  @Input() vehiculo: VehiculoResponse | null = null;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  vehiculoForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private toastr: ToastrService
  ) {
    this.vehiculoForm = this.fb.group({
      matricula: ['', [Validators.required, Validators.maxLength(20)]],
      marca: ['', [Validators.required, Validators.maxLength(100)]],
      modelo: ['', [Validators.required, Validators.maxLength(100)]],
      anyoFabricacion: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      color: ['', Validators.maxLength(50)],
      kilometros: ['', [Validators.required, Validators.min(0)]],
      numeroBastidor: ['', [Validators.required, Validators.maxLength(50)]],
      tipoCombustible: ['', Validators.required],
      situacionId: [null]
    });
  }

  ngOnInit(): void {
    if (this.esEdicion && this.vehiculo) {
      this.vehiculoForm.patchValue({
        matricula: this.vehiculo.matricula,
        marca: this.vehiculo.marca,
        modelo: this.vehiculo.modelo,
        anyoFabricacion: this.vehiculo.anyoFabricacion,
        color: this.vehiculo.color,
        kilometros: this.vehiculo.kilometros,
        numeroBastidor: this.vehiculo.numeroBastidor,
        tipoCombustible: this.vehiculo.tipoCombustible
      });
    }
  }

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
      this.vehiculoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const vehiculoData: VehiculoRequest = this.vehiculoForm.value;

    const operacion = this.esEdicion && this.vehiculo
      ? this.vehiculoService.actualizar(this.vehiculo.id, vehiculoData)
      : this.vehiculoService.crear(vehiculoData);

    operacion.subscribe({
      next: () => {
        this.toastr.success(
          `Vehículo ${this.esEdicion ? 'actualizado' : 'creado'} correctamente`,
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
    const field = this.vehiculoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}