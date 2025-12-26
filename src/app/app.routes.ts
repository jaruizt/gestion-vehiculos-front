import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/components/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { VehiculoListComponent } from './features/vehiculos/components/vehiculo-list/vehiculo-list.component';
import { ClienteListComponent } from './features/clientes/components/cliente-list/cliente-list.component';
import { ContratoListComponent } from './features/contratos/components/contrato-list/contrato-list.component';
import { FacturaListComponent } from './features/facturas/components/factura-list/factura-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'vehiculos',
    component: VehiculoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'clientes', 
    component: ClienteListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'contratos',
    component: ContratoListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'facturas', 
    component: FacturaListComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/home' }
];