import { Component, input, output, inject } from '@angular/core';
import { Track } from '../models/track';
import { DurationFormatPipe } from '../pipes/duration-format-pipe';
import { HighlightFavorite } from '../directives/highlight-favorite.directive';
import { TrackService } from '../services/track.service';

@Component({
  selector: 'app-track-card',
  imports: [DurationFormatPipe, HighlightFavorite],
  templateUrl: './track-card.html',
  styleUrl: './track-card.css',
})
export class TrackCard {
  track = input.required<Track>();
  active = input(false);
  select = output<Track>();
  favoriteToggle = output<Track>();
  private trackService = inject(TrackService);

  protected selectTrack(): void {
    this.select.emit(this.track());
  }

  protected toggleFavorite(event: MouseEvent): void {
    // Prevent the click from bubbling up to activate track selection
    event.stopPropagation();

    // Emit the track so parent can handle the toggle
    this.favoriteToggle.emit(this.track());
  }
}