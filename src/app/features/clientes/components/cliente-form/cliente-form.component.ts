import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { ClienteResponse, ClienteRequest } from '../../../../core/models';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  @Input() cliente: ClienteResponse | null = null;
  @Input() esEdicion = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  clienteForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {
    this.clienteForm = this.fb.group({
      tipoCliente: ['', Validators.required],
      dni: ['', [Validators.required, Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    if (this.esEdicion && this.cliente) {
      this.clienteForm.patchValue({
        tipoCliente: this.cliente.tipoCliente,
        dni: this.cliente.dni,
        nombre: this.cliente.nombre,
        email: this.cliente.email,
        telefono: this.cliente.telefono,
        direccion: this.cliente.direccion
      });
    }
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const clienteData: ClienteRequest = this.clienteForm.value;

    const operacion = this.esEdicion && this.cliente
      ? this.clienteService.actualizar(this.cliente.id, clienteData)
      : this.clienteService.crear(clienteData);

    operacion.subscribe({
      next: () => {
        this.toastr.success(
          `Cliente ${this.esEdicion ? 'actualizado' : 'creado'} correctamente`,
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
    const field = this.clienteForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}