import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FacturaCompraService } from '../../services/factura-compra.service';
import { FacturaCompraResponse } from '../../../../core/models';
import { FacturaCompraFormComponent } from '../factura-compra-form/factura-compra-form.component';

@Component({
  selector: 'app-factura-compra-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FacturaCompraFormComponent],
  templateUrl: './factura-compra-list.component.html',
  styleUrls: ['./factura-compra-list.component.scss']
})
export class FacturaCompraListComponent implements OnInit {
  facturas: FacturaCompraResponse[] = [];
  facturasFiltradas: FacturaCompraResponse[] = [];
  loading = false;
  
  filtroTexto = '';
  
  mostrarModal = false;
  esEdicion = false;
  facturaSeleccionada: FacturaCompraResponse | null = null;

  constructor(
    private facturaCompraService: FacturaCompraService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarFacturas();
  }

  cargarFacturas(): void {
    this.loading = true;
    this.facturaCompraService.listarActivas().subscribe({
      next: (data) => {
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
        f.proveedorNombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
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

  abrirModalEditar(factura: FacturaCompraResponse): void {
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

  verDetalle(factura: FacturaCompraResponse): void {
    console.log('Ver detalle:', factura);
  }

  confirmarEliminar(factura: FacturaCompraResponse): void {
    if (confirm(`¿Estás seguro de eliminar la factura ${factura.numeroFactura}?`)) {
      this.facturaCompraService.desactivar(factura.id).subscribe({
        next: () => {
          this.toastr.success('Factura eliminada correctamente');
          this.cargarFacturas();
        }
      });
    }
  }
}