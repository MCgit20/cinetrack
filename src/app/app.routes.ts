import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tracks', pathMatch: 'full' },
  { path: 'tracks', loadComponent: () => import('./track-list/track-list').then((m) => m.TrackList) },
  { path: 'tracks/new', canActivate: [authGuard],
    loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'tracks/:id', loadComponent: () => import('./track-detail/track-detail').then((m) => m.TrackDetail) },
  { path: 'tracks/:id/edit', canActivate: [authGuard],
    loadComponent: () => import('./track-form/track-form').then((m) => m.TrackForm) },
  { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login) },
];