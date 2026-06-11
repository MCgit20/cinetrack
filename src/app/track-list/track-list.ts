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

  protected tracks = signal<Track[]>([]);
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
    this.loadTracks();

    this.routerSubscription = this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd && event.urlAfterRedirects === '/tracks') {
        this.loadTracks();
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private loadTracks(): void {
    this.service.getTracks().subscribe({
      next: (tracks) => {
        this.tracks.set(tracks);
      },
      error: (err) => {
        console.error('Error loading tracks:', err);
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
        this.tracks.update(currentTracks =>
          currentTracks.map(t =>
            t.id === track.id ? { ...t, favorite: !isCurrentlyFavorite } : t
          )
        );
      },
      error: (err) => {
        console.error('Error toggling favorite:', err);
      }
    });
  }
}