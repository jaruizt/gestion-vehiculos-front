import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../services/cliente.service';
import { ClienteResponse } from '../../../../core/models';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, FormsModule,  ClienteFormComponent],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  clientes: ClienteResponse[] = [];
  clientesFiltrados: ClienteResponse[] = [];
  loading = false;
  
  filtroTexto = '';
  filtroTipo = '';
  
  mostrarModal = false;
  esEdicion = false;
  clienteSeleccionado: ClienteResponse | null = null;

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService.listarActivos().subscribe({
      next: (data) => {
        this.clientes = data;
        this.clientesFiltrados = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.clientesFiltrados = this.clientes.filter(c => {
      const textoMatch = !this.filtroTexto || 
        c.dni.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        c.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        c.email.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        c.telefono.includes(this.filtroTexto);
      
      const tipoMatch = !this.filtroTipo || c.tipoCliente === this.filtroTipo;
      
      return textoMatch && tipoMatch;
    });
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroTipo = '';
    this.aplicarFiltros();
  }

  abrirModalCrear(): void {
    this.clienteSeleccionado = null;
    this.esEdicion = false;
    this.mostrarModal = true;
  }

  abrirModalEditar(cliente: ClienteResponse): void {
    this.clienteSeleccionado = cliente;
    this.esEdicion = true;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.clienteSeleccionado = null;
  }

  onClienteGuardado(): void {
    this.cerrarModal();
    this.cargarClientes();
  }

  verDetalle(cliente: ClienteResponse): void {
    console.log('Ver detalle:', cliente);
  }

  confirmarEliminar(cliente: ClienteResponse): void {
    if (confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre}?`)) {
      this.clienteService.desactivar(cliente.id).subscribe({
        next: () => {
          this.toastr.success('Cliente eliminado correctamente');
          this.cargarClientes();
        }
      });
    }
  }

  obtenerClaseTipo(tipo?: string): string {
    const clases: { [key: string]: string } = {
      'PARTICULAR': 'badge-particular',
      'EMPRESA': 'badge-empresa',
      'AUTONOMO': 'badge-autonomo'
    };
    return clases[tipo || ''] || '';
  }
}