import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FacturaVentaService } from '../../services/factura-venta.service';
import { FacturaVentaResponse } from '../../../../core/models';
import { FacturaVentaFormComponent } from '../factura-venta-form/factura-venta-form.component';

@Component({
  selector: 'app-factura-venta-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FacturaVentaFormComponent],
  templateUrl: './factura-venta-list.component.html',
  styleUrls: ['./factura-venta-list.component.scss']
})
export class FacturaVentaListComponent implements OnInit {
  facturas: FacturaVentaResponse[] = [];
  facturasFiltradas: FacturaVentaResponse[] = [];
  loading = false;
  
  filtroTexto = '';
  
  mostrarModal = false;
  mostrarModalDetalle = false;
  esEdicion = false;
  facturaSeleccionada: FacturaVentaResponse | null = null;

  constructor(
    private facturaVentaService: FacturaVentaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.loading = true;
    this.facturaVentaService.listarActivas().subscribe({
      next: (data) => {
              console.log('Facturas recibidas:', data); 
        this.facturas = data;
        this.facturasFiltradas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.facturasFiltradas = this.facturas.filter(f => {
      return !this.filtroTexto || 
        f.numeroFactura.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        f.vehiculoMatricula.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        f.clienteNombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        f.clienteDni.toLowerCase().includes(this.filtroTexto.toLowerCase());
    });
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.facturaSeleccionada = null;
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(factura: FacturaVentaResponse): void {
    this.facturaSeleccionada = factura;
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.facturaSeleccionada = null;
  }

  onFacturaGuardada(): void {
    this.cerrarModal();
    this.cargarFacturas();
  }

  verDetalle(factura: FacturaVentaResponse): void {
    console.log('Ver detalle:', factura);
     this.facturaSeleccionada = factura;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle(): void { 
    this.mostrarModalDetalle = false;
    this.facturaSeleccionada = null;
  }

  calcularPorcentajeBeneficio(factura: FacturaVentaResponse): string {
  if (!factura.beneficio || !factura.importeTotal) return '0.00';
  
  // Calcular precio de compra = precio venta - beneficio
  const precioCompra = factura.importeTotal - factura.beneficio;
  
  if (precioCompra === 0) return '0.00';
  
  const porcentaje = (factura.beneficio / precioCompra) * 100;
  return porcentaje.toFixed(2);
}

  confirmarEliminar(factura: FacturaVentaResponse): void {
    if (confirm(`¿Estás seguro de eliminar la factura ${factura.numeroFactura}?`)) {
      this.facturaVentaService.desactivar(factura.id).subscribe({
        next: () => {
          this.toastr.success('Factura eliminada correctamente');
          this.cargarFacturas();
        }
      });
    }
  }
}