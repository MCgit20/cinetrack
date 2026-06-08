import { Component, signal } from '@angular/core';
import { TrackList } from './track-list/track-list';
import { Track } from './models/track';

@Component({
  selector: 'app-root',
  imports: [TrackList],
  templateUrl: './app.html',
})
export class App {
  protected tracks = signal<Track[]>([
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours',
      genre: 'Synth-pop', durationSeconds: 200, year: 2019, rating: 9,
      favorite: true, coverUrl: 'https://picsum.photos/seed/1/300' },
    { id: 2, title: 'As It Was', artist: 'Harry Styles', album: "Harry's House",
      genre: 'Pop', durationSeconds: 167, year: 2022, rating: 8,
      favorite: false, coverUrl: 'https://picsum.photos/seed/2/300' },
    { id: 3, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia',
      genre: 'Disco-pop', durationSeconds: 203, year: 2020, rating: 7,
      favorite: true, coverUrl: 'https://picsum.photos/seed/3/300' },
      { id: 4, title: 'Watermelon Sugar', artist: 'Harry Styles', album: "Fine Line",
        genre: 'Pop rock', durationSeconds: 174, year: 2019, rating: 8,
        favorite: false, coverUrl: 'https://picsum.photos/seed/4/300' },
      { id: 5, title: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia',
        genre: 'Disco-pop', durationSeconds: 183, year: 2019, rating: 7,
        favorite: true, coverUrl: 'https://picsum.photos/seed/5/300' },
      { id: 6, title: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours',
        genre: 'Synth-pop', durationSeconds: 215, year: 2020, rating: 8,
        favorite: false, coverUrl: 'https://picsum.photos/seed/6/300' }
    // … autres morceaux
  ]);
}