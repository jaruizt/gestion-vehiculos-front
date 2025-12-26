import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratoService } from '../../services/contrato.service';
import { ContratoRentingResponse, CuotaRentingResponse } from '../../../../core/models';

@Component({
  selector: 'app-cuotas-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cuotas-modal.component.html',
  styleUrls: ['./cuotas-modal.component.scss']
})
export class CuotasModalComponent implements OnInit {
  @Input() contrato: ContratoRentingResponse | null = null;
  @Output() cerrar = new EventEmitter<void>();

  cuotas: CuotaRentingResponse[] = [];
  loading = false;

  constructor(private contratoService: ContratoService) {}

  ngOnInit(): void {
    if (this.contrato) {
      this.cargarCuotas();
    }
  }

  cargarCuotas(): void {
    if (!this.contrato) return;

    this.loading = true;
    this.contratoService.obtenerCuotas(this.contrato.id).subscribe({
      next: (data) => {
        this.cuotas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  obtenerClaseEstado(estado?: string): string {
    const clases: { [key: string]: string } = {
      'PENDIENTE': 'badge-reservado',
      'PAGADA': 'badge-disponible',
      'VENCIDA': 'badge-vendido'
    };
    return clases[estado || ''] || '';
  }
}