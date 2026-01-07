import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VehiculoService } from '../../services/vehiculo.service';
import { VehiculoResponse } from '../../../../core/models';
import { VehiculoFormComponent } from '../vehiculo-form/vehiculo-form.component';
import { ReservaVentaFormComponent } from '../reserva-venta-form/reserva-venta-form.component';
import { ReservaVentaService, ReservaVentaResponse } from '../../services/reserva-venta.service';

@Component({
  selector: 'app-vehiculo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, VehiculoFormComponent, ReservaVentaFormComponent],
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

  mostrarModalDetalle = false;
  vehiculoDetalle: VehiculoResponse | null = null;

  mostrarModalReserva = false;
  mostrarModalVenta = false;
  mostrarModalReservaDetalle = false;
  reservaDetalle: ReservaVentaResponse | null = null;
  loadingReserva = false;

  constructor(
    private vehiculoService: VehiculoService,
    private reservaVentaService: ReservaVentaService,
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
    console.log('Ver detalle:', vehiculo);
    this.vehiculoDetalle = vehiculo;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle(): void {
    this.mostrarModalDetalle = false;
    this.vehiculoDetalle = null;
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

// Métodos:
abrirModalReserva(vehiculo: VehiculoResponse): void {
  console.log('Ver reserva:', vehiculo);
  this.vehiculoSeleccionado = vehiculo;
  this.mostrarModalReserva = true;
}

cerrarModalReserva(): void {
  this.mostrarModalReserva = false;
  this.vehiculoSeleccionado = null;
}

onReservaCreada(): void {
  this.cerrarModalReserva();
  this.cargarVehiculos();
}

abrirModalVenta(vehiculo: VehiculoResponse): void {
  this.vehiculoSeleccionado = vehiculo;
  this.mostrarModalVenta = true;
}

cerrarModalVenta(): void {
  this.mostrarModalVenta = false;
  this.vehiculoSeleccionado = null;
}

onVentaCreada(): void {
  this.cerrarModalVenta();
  this.cargarVehiculos();
}

verReserva(vehiculo: VehiculoResponse): void {
  this.loadingReserva = true;
  // Buscar la reserva activa del vehículo
  this.reservaVentaService.listarActivas().subscribe({
    next: (reservas) => {
      const reserva = reservas.find(r => r.vehiculoId === vehiculo.id);
      
      if (reserva) {
        console.log('Ver reserva:', reserva);
        this.reservaDetalle = reserva;
        this.mostrarModalReservaDetalle = true;
      } else {
        this.toastr.warning('No se encontró reserva activa para este vehículo', 'Advertencia');
      }
      
      this.loadingReserva = false;
    },
    error: () => {
      this.toastr.error('Error al cargar la reserva', 'Error');
      this.loadingReserva = false;
    }
  });
}

cerrarModalReservaDetalle(): void {
  this.mostrarModalReservaDetalle = false;
  this.reservaDetalle = null;
}

confirmarCancelarReserva(): void {
  if (!this.reservaDetalle) return;
  
  const motivo = prompt('Ingrese el motivo de cancelación:');
  
  if (motivo && motivo.trim() !== '') {
    this.reservaVentaService.cancelar(this.reservaDetalle.id, motivo).subscribe({
      next: () => {
        this.toastr.success('Reserva cancelada correctamente', '¡Éxito!');
        this.cerrarModalReservaDetalle();
        this.cargarVehiculos();
      },
      error: () => {
        this.toastr.error('Error al cancelar la reserva', 'Error');
      }
    });
  }
}

  obtenerClaseEstadoReserva(estado?: string): string {
    console.log('Ver estado:', estado);
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'bg-warning text-dark',
      'CONFIRMADA': 'bg-success text-white',
      'CANCELADA': 'bg-danger text-white',
      'EXPIRADA': 'bg-secondary text-white'
    };
    return clases[estado || ''] || 'bg-secondary text-white';
  }
}