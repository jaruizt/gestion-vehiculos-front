import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ContratoService } from '../../services/contrato.service';
import { ContratoRentingResponse } from '../../../../core/models';
import { ContratoFormComponent } from '../contrato-form/contrato-form.component';
import { CuotasModalComponent } from '../cuotas-modal/cuotas-modal.component'; 

@Component({
  selector: 'app-contrato-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ContratoFormComponent, CuotasModalComponent ],
  templateUrl: './contrato-list.component.html',
  styleUrls: ['./contrato-list.component.scss']
})
export class ContratoListComponent implements OnInit {
  contratos: ContratoRentingResponse[] = [];
  contratosFiltrados: ContratoRentingResponse[] = [];
  loading = false;
  
  filtroTexto = '';
  filtroEstado = '';
  
  mostrarModal = false;
  mostrarModalCuotas = false;
  esEdicion = false;
  contratoSeleccionado: ContratoRentingResponse | null = null;
  mostrarModalDetalle = false;

  constructor(
    private contratoService: ContratoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.loading = true;
    this.contratoService.listarActivos().subscribe({
      next: (data) => {
        this.contratos = data;
        this.contratosFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.contratosFiltrados = this.contratos.filter(c => {
      const textoMatch = !this.filtroTexto || 
        c.vehiculoMatricula.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        c.clienteNombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        c.clienteDni.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const estadoMatch = !this.filtroEstado || c.estadoNombre === this.filtroEstado;
      
      return textoMatch && estadoMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroEstado = '';
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.contratoSeleccionado = null;
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(contrato: ContratoRentingResponse): void {
    this.contratoSeleccionado = contrato;
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.contratoSeleccionado = null;
  }

  onContratoGuardado(): void {
    this.cerrarModal();
    this.cargarContratos();
  }

  verCuotas(contrato: ContratoRentingResponse): void {
    this.contratoSeleccionado = contrato;
    this.mostrarModalCuotas = true;
  }

  cerrarModalCuotas(): void {
    this.mostrarModalCuotas = false;
    this.contratoSeleccionado = null;
  }

  verDetalle(contrato: ContratoRentingResponse): void {
    console.log('Ver detalle:', contrato);
    this.contratoSeleccionado = contrato;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.contratoSeleccionado = null;
  }

  activarContrato(contrato: ContratoRentingResponse): void {
    if (confirm(`¿Está seguro de activar el contrato ${contrato.numeroContrato}?`)) {
      this.contratoService.activarContrato(contrato.id).subscribe({
        next: () => {
          this.toastr.success('Contrato activado correctamente', '¡Éxito!');
          this.cargarContratos();
        },
        error: (error) => {
          this.toastr.error('Error al activar el contrato', 'Error');
        }
      });
    }
  }

  cancelarContrato(contrato: ContratoRentingResponse): void {
    const motivo = prompt(`Ingrese el motivo de cancelación del contrato ${contrato.numeroContrato}:`);
    
    if (motivo && motivo.trim() !== '') {
      this.contratoService.cancelarContrato(contrato.id, motivo).subscribe({
        next: () => {
          this.toastr.success('Contrato cancelado correctamente', '¡Éxito!');
          this.cargarContratos();
        },
        error: (error) => {
          this.toastr.error('Error al cancelar el contrato', 'Error');
        }
      });
    }
  }

  finalizarContrato(contrato: ContratoRentingResponse): void {
    if (confirm(`¿Estás seguro de finalizar el contrato del vehículo ${contrato.vehiculoMatricula}?`)) {
      this.contratoService.finalizarContrato(contrato.id).subscribe({
        next: () => {
          this.toastr.success('Contrato finalizado correctamente');
          this.cargarContratos();
        }
      });
    }
  }

  confirmarEliminar(contrato: ContratoRentingResponse): void {
    if (confirm(`¿Estás seguro de eliminar el contrato del vehículo ${contrato.vehiculoMatricula}?`)) {
      this.contratoService.desactivar(contrato.id).subscribe({
        next: () => {
          this.toastr.success('Contrato eliminado correctamente');
          this.cargarContratos();
        }
      });
    }
  }

  obtenerClaseEstado(estado?: string): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'badge-reservado',
      'ACTIVO': 'badge-renting',
      'FINALIZADO': 'badge-vendido',
      'CANCELADO': 'badge-vendido'
    };
      return clases[estado || '']; 
  }
}