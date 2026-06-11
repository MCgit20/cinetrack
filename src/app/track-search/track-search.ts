import { Component, input, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Track } from '../models/track';

@Component({
  selector: 'app-track-search',
  templateUrl: './track-search.html',
  styleUrl: './track-search.css',
})
export class TrackSearch {
  localTracks = input<Track[]>([]);
  searchTermChanged = output<string>();

  protected term = signal('');

  constructor() {
    // Emit search term changes for filtering in parent component
    toObservable(this.term).pipe(
      debounceTime(300), // R4t8M2
      distinctUntilChanged() // B6n1C9
    ).subscribe(term => {
      this.searchTermChanged.emit(term);
    });
  }
}