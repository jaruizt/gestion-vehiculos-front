import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VehiculoService } from '../../services/vehiculo.service';
import { VehiculoResponse } from '../../../../core/models';
import { VehiculoFormComponent } from '../vehiculo-form/vehiculo-form.component';

@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, VehiculoFormComponent],
  templateUrl: './vehiculo-list.component.html',
  styleUrls: ['./vehiculo-list.component.scss']
})
export class VehiculoListComponent implements OnInit {
  vehiculos: VehiculoResponse[] = [];
  vehiculosFiltrados: VehiculoResponse[] = [];
  loading = false;
  
  filtroTexto = '';
  filtroSituacion = '';
  filtroCombustible = '';
  
  mostrarModal = false;
  esEdicion = false;
  vehiculoSeleccionado: VehiculoResponse | null = null;

  constructor(
    private vehiculoService: VehiculoService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.loading = true;
    this.vehiculoService.listarActivos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.vehiculosFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.vehiculosFiltrados = this.vehiculos.filter(v => {
      const textoMatch = !this.filtroTexto || 
        v.matricula.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        v.marca.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        v.modelo.toLowerCase().includes(this.filtroTexto.toLowerCase());
      
      const situacionMatch = !this.filtroSituacion || v.situacionNombre === this.filtroSituacion;
      const combustibleMatch = !this.filtroCombustible || v.tipoCombustible === this.filtroCombustible;
      
      return textoMatch && situacionMatch && combustibleMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroSituacion = '';
    this.filtroCombustible = '';
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.vehiculoSeleccionado = null;
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(vehiculo: VehiculoResponse): void {
    this.vehiculoSeleccionado = vehiculo;
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.vehiculoSeleccionado = null;
  }

  onVehiculoGuardado(): void {
    this.cerrarModal();
    this.cargarVehiculos();
  }

  verDetalle(vehiculo: VehiculoResponse): void {
    // Implementar después
    console.log('Ver detalle:', vehiculo);
  }

  confirmarEliminar(vehiculo: VehiculoResponse): void {
    if (confirm(`¿Estás seguro de eliminar el vehículo ${vehiculo.matricula}?`)) {
      this.vehiculoService.desactivar(vehiculo.id).subscribe({
        next: () => {
          this.toastr.success('Vehículo eliminado correctamente');
          this.cargarVehiculos();
        }
      });
    }
  }

  obtenerClaseSituacion(situacion?: string): string {
    const clases: { [key: string]: string } = {
      'DISPONIBLE': 'badge-disponible',
      'EN_RENTING': 'badge-renting',
      'RESERVADO': 'badge-reservado',
      'VENDIDO': 'badge-vendido'
    };
    return clases[situacion || ''] || '';
  }
}