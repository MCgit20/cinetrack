import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TrackCard } from '../track-card/track-card';
import { Track } from '../models/track';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-favorites',
  imports: [TrackCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private service = inject(TrackService);
  private router = inject(Router);

  protected favorites = signal<Track[]>([]);
  protected loading = signal(true);
  protected error = signal<string | null>(null);

  constructor() {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.getFavorites().subscribe({
      next: (favorites) => {
        this.favorites.set(favorites);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.error.set('Impossible de charger les favoris');
        this.loading.set(false);
      }
    });
  }

  protected openTrackDetail(track: Track): void {
    this.router.navigate(['/tracks', track.id]);
  }

  protected onFavoriteToggle(track: Track): void {
    const isCurrentlyFavorite = track.favorite;
    const favoriteAction$ = isCurrentlyFavorite
      ? this.service.removeFavorite(track.id)
      : this.service.addFavorite(track.id);

    favoriteAction$.subscribe({
      next: () => {
        // Optimistically update the track's favorite status
        const updatedTrack = { ...track, favorite: !isCurrentlyFavorite };
        // Update the favorites list
        const currentFavorites = this.favorites();
        if (isCurrentlyFavorite) {
          // Removing from favorites - filter out the track
          this.favorites.set(currentFavorites.filter(t => t.id !== track.id));
        } else {
          // Adding to favorites - add the track to the list
          this.favorites.set([...currentFavorites, updatedTrack]);
        }
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
        // In a real app, we might show a toast or snackbar
        // For now, we'll just log the error and revert the optimistic update
        // (though the UI won't show the update until next load due to our implementation)
      }
    });
  }
}