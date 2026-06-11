import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd, Event as RouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { TrackCard } from '../track-card/track-card';
import { TrackSearch } from '../track-search/track-search';
import { Track } from '../models/track';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-track-list',
  imports: [TrackCard, TrackSearch],
  templateUrl: './track-list.html',
  styleUrl: './track-list.css',
})
export class TrackList implements OnInit, OnDestroy {
  private service = inject(TrackService);
  private router = inject(Router);
  private routerSubscription: Subscription | null = null;

  protected tracks = signal<Track[]>([]);        // ✅ plus d'input
  protected selection = signal<number | null>(null);
  protected searchTerm = signal('');
  protected filteredTracks = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.tracks();
    }
    return this.tracks().filter(track =>
      track.title.toLowerCase().includes(term) ||
      track.artist.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    // Load tracks when component initializes
    this.loadTracks();

    // Also reload tracks when we navigate to the tracks route
    this.routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/tracks') {
        this.loadTracks();
      }
    });
  }

  ngOnDestroy(): void {
    // Clean up router subscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private loadTracks(): void {
    this.service.getTracks().subscribe({
      next: (tracks) => {
        this.tracks.set(tracks);
      },
      error: (err) => {
        console.error('Error loading tracks:', err);
        // In a real app, we might show an error message to the user
      }
    });
  }

  protected selectTrack(track: Track): void {
    this.selection.set(track.id);
    this.router.navigate(['/tracks', track.id]);
  }

  protected onSearchTermChanged(term: string): void {
    this.searchTerm.set(term);
  }

  protected onFavoriteToggle(track: Track): void {
    const isCurrentlyFavorite = track.favorite;
    const favoriteAction$ = isCurrentlyFavorite
      ? this.service.removeFavorite(track.id)
      : this.service.addFavorite(track.id);

    favoriteAction$.subscribe({
      next: () => {
        // Optimistically update the track in our list
        const updatedTrack = { ...track, favorite: !isCurrentlyFavorite };
        // Update the tracks signal
        const currentTracks = this.tracks();
        const trackIndex = currentTracks.findIndex(t => t.id === track.id);
        if (trackIndex !== -1) {
          const updatedTracks = [...currentTracks];
          updatedTracks[trackIndex] = updatedTrack;
          this.tracks.set(updatedTracks);

          // Also update filteredTracks if needed
          const currentFiltered = this.filteredTracks();
          const filteredIndex = currentFiltered.findIndex(t => t.id === track.id);
          if (filteredIndex !== -1) {
            const updatedFiltered = [...currentFiltered];
            updatedFiltered[filteredIndex] = updatedTrack;
            this.filteredTracks.set(updatedFiltered);
          }
        }
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
        // In a real app, we might show a user notification
        // For now, we'll just log and not update optimistically on error
      }
    });
  }
}