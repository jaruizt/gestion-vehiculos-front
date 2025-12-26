import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturaCompraListComponent } from '../factura-compra-list/factura-compra-list.component';
import { FacturaVentaListComponent } from '../factura-venta-list/factura-venta-list.component';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, FacturaCompraListComponent,
    FacturaVentaListComponent ],
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaListComponent {
  tabActiva: 'compra' | 'venta' = 'compra';

  cambiarTab(tab: 'compra' | 'venta'): void {
    this.tabActiva = tab;
  }
}