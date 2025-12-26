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
  }

  confirmarFinalizar(contrato: ContratoRentingResponse): void {
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
      'ACTIVO': 'badge-renting',
      'FINALIZADO': 'badge-vendido',
      'CANCELADO': 'badge-vendido'
    };
    return clases[estado || ''] || '';
  }
}