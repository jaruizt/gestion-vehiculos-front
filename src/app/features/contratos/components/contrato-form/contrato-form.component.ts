import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { ContratoService } from '../../services/contrato.service';
import { VehiculoService } from '../../../vehiculos/services/vehiculo.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { ContratoRentingResponse, ContratoRentingRequest, VehiculoResponse, ClienteResponse } from '../../../../core/models';

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.scss']
})
export class ContratoFormComponent implements OnInit {
  @Input() contrato: ContratoRentingResponse | null = null;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  contratoForm: FormGroup;
  loading = false;
  vehiculosDisponibles: VehiculoResponse[] = [];
  clientes: ClienteResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private vehiculoService: VehiculoService,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.contratoForm = this.fb.group({
      vehiculoId: ['', Validators.required],
      clienteId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      cuotaMensual: ['', [Validators.required, Validators.min(0)]],
      diaCobroCuota: ['', [Validators.required, Validators.min(1), Validators.max(31)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();

    if (this.esEdicion && this.contrato) {
      this.contratoForm.patchValue({
        vehiculoId: this.contrato.vehiculoId,
        clienteId: this.contrato.clienteId,
        fechaInicio: this.contrato.fechaInicio,
        fechaFin: this.contrato.fechaFin,
        cuotaMensual: this.contrato.cuotaMensual,
        diaCobroCuota: this.contrato.diaCobroCuota
      });
    }
  }

  cargarDatos(): void {
    forkJoin({
      vehiculos: this.vehiculoService.listarActivos(),
      clientes: this.clienteService.listarActivos()
    }).subscribe({
      next: ({ vehiculos, clientes }) => {
        this.vehiculosDisponibles = vehiculos.filter(v => v.situacionNombre === 'DISPONIBLE');
        this.clientes = clientes;
      }
    });
  }

  onSubmit(): void {
    if (this.contratoForm.invalid) {
      this.contratoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const contratoData: ContratoRentingRequest = this.contratoForm.value;

    const operacion = this.esEdicion && this.contrato
      ? this.contratoService.actualizar(this.contrato.id, contratoData)
      : this.contratoService.crear(contratoData);

    operacion.subscribe({
      next: () => {
        this.toastr.success(
          `Contrato ${this.esEdicion ? 'actualizado' : 'creado'} correctamente`,
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
    const field = this.contratoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}