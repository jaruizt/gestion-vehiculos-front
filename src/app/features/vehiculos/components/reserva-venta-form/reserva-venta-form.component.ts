import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReservaVentaService, ReservaVentaRequest } from '../../services/reserva-venta.service';
import { ClienteService } from '../../../clientes/services/cliente.service';
import { VehiculoResponse, ClienteResponse } from '../../../../core/models';

@Component({
  selector: 'app-reserva-venta-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reserva-venta-form.component.html',
  styleUrls: ['./reserva-venta-form.component.scss']
})
export class ReservaVentaFormComponent implements OnInit {
  @Input() vehiculo: VehiculoResponse | null = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  reservaForm: FormGroup;
  clientes: ClienteResponse[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private reservaVentaService: ReservaVentaService,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.reservaForm = this.fb.group({
      clienteId: ['', Validators.required],
      fechaReserva: [new Date().toISOString().split('T')[0], Validators.required],
      precioReserva: ['', [Validators.required, Validators.min(0)]],
      senalPagada: ['', Validators.min(0)],
      fechaLimite: [''],
      estado: ['PENDIENTE'],
      observaciones: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.cargarClientes();

    const hoy = new Date().toISOString().split('T')[0];
    // Establecer fecha límite por defecto (15 días desde hoy)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 15);
    this.reservaForm.patchValue({
      fechaReserva: hoy,
      fechaLimite: fechaLimite.toISOString().split('T')[0],
      estado: 'PENDIENTE'
    });
  }

  cargarClientes(): void {
    this.clienteService.listarActivos().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.toastr.error('Error al cargar clientes', 'Error');
      }
    });
  }

  onSubmit(): void {
    if (this.reservaForm.invalid || !this.vehiculo) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    const reservaData: ReservaVentaRequest = {
      ...this.reservaForm.value,
      vehiculoId: this.vehiculo.id
    };

    this.reservaVentaService.crear(reservaData).subscribe({
      next: () => {
        this.toastr.success('Reserva creada correctamente', '¡Éxito!');
        this.guardado.emit();
      },
      error: (error) => {
        this.toastr.error(
          error.error?.message || 'Error al crear la reserva',
          'Error'
        );
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.reservaForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}