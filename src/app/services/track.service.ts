import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Track } from '../models/track';
import { environment } from '../../environnements/environnement';

export type TrackPayload = Omit<Track, 'id'>;

@Injectable({ providedIn: 'root' })
export class TrackService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tracks`; // Q7v3K8
  private favoritesBaseUrl = `${environment.apiUrl}/favorites`;

  getTracks() {
    return this.http.get<Track[]>(this.baseUrl);
  }

  getTrack(id: number) {
    return this.http.get<Track>(`${this.baseUrl}/${id}`);
  }

  search(query: string) {
    const params = new HttpParams().set('q', query);
    return this.http.get<Track[]>(this.baseUrl, { params });
  }

  create(track: TrackPayload) {
    return this.http.post<Track>(this.baseUrl, track); // C2R3D4
  }

  update(id: number, changes: Partial<TrackPayload>) {
    return this.http.patch<Track>(`${this.baseUrl}/${id}`, changes); // U5P6D7
  }

  remove(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`); // D8L9T1
  }

  // Favorites functionality
  getFavorites() {
    return this.http.get<Track[]>(this.favoritesBaseUrl);
  }

  addFavorite(trackId: number) {
    return this.http.post<void>(`${this.favoritesBaseUrl}/${trackId}`, {});
  }

  removeFavorite(trackId: number) {
    return this.http.delete<void>(`${this.favoritesBaseUrl}/${trackId}`);
  }
}