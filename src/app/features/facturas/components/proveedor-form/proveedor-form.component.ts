import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProveedorService } from '../../services/proveedor.service';
import { ProveedorRequest } from '../../../../core/models';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.scss']
})
export class ProveedorFormComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  proveedorForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private toastr: ToastrService
  ) {
    this.proveedorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      cif: ['', [Validators.required, Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      direccion: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit(): void {
    if (this.proveedorForm.invalid) {
      this.proveedorForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const proveedorData: ProveedorRequest = this.proveedorForm.value;

    this.proveedorService.crear(proveedorData).subscribe({
      next: () => {
        this.toastr.success('Proveedor creado correctamente', '¡Éxito!');
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
    const field = this.proveedorForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}