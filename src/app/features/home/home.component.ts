import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { EstadisticasService, EstadisticasDashboard } from './services/estadisticas.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nombreUsuario: string = '';
  rolUsuario: string = '';
  loading = false;
  estadisticas: EstadisticasDashboard | null = null;

  constructor(
    private authService: AuthService,
    private estadisticasService: EstadisticasService
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarEstadisticas();
  }

  cargarDatosUsuario(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.nombreUsuario = usuario.username;
      this.rolUsuario = usuario.rol;
    }
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.estadisticasService.obtenerEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  calcularPorcentaje(cantidad: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((cantidad / total) * 100);
  }

  obtenerClaseSituacion(situacion: string): string {
    const clases: { [key: string]: string } = {
      'DISPONIBLE': 'badge-disponible',
      'EN_RENTING': 'badge-renting',
      'RESERVADO': 'badge-reservado',
      'VENDIDO': 'badge-vendido'
    };
    return clases[situacion] || 'badge-disponible';
  }

  obtenerClaseEstado(estado: string): string {
    const clases: { [key: string]: string } = {
      'ACTIVO': 'badge-renting',
      'FINALIZADO': 'badge-vendido',
      'CANCELADO': 'badge-vendido'
    };
    return clases[estado] || 'badge-renting';
  }
}