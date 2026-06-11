import { Component, DestroyRef, computed, effect, inject, input, numberAttribute, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, required, min, max } from '@angular/forms/signals';
import { catchError, of, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TrackPayload, TrackService } from '../services/track.service';

const currentYear = new Date().getFullYear();

@Component({
  selector: 'app-track-form',
  imports: [FormField],
  templateUrl: './track-form.html',
  styleUrl: './track-form.css',
})
export class TrackForm {
  id = input<number | undefined, unknown>(undefined, {
    transform: (value) => (value === undefined || value === null ? undefined : numberAttribute(value)),
  }); // E2D3T4

  private destroyRef = inject(DestroyRef);
  private router = inject(Router); // F2R3M4
  private trackService = inject(TrackService);

  protected model = signal({
    title: '',
    artist: '',
    album: '',
    genre: '',
    durationSeconds: 0,
    year: currentYear,
    rating: 5,
    favorite: false,
    coverUrl: ''
  });
  protected isSaving = signal(false);
  protected saveFailed = signal(false);
  protected loadFailed = signal(false);
  protected isEditMode = computed(() => this.id() !== undefined && !Number.isNaN(this.id()));
  protected title = computed(() => (this.isEditMode() ? 'Modifier le morceau' : 'Ajouter un morceau'));

  private trackToEdit = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => {
        if (id === undefined || Number.isNaN(id)) {
          return of(null);
        }

        return this.trackService.getTrack(id).pipe(
          catchError(() => {
            this.loadFailed.set(true);
            return of(null);
          }),
        );
      }),
    ),
    { initialValue: null },
  );

  protected trackForm = form(this.model, (path) => {
    required(path.title, { message: 'Le titre est requis' });
    required(path.artist, { message: "L'artiste est requis" });
    min(path.rating, 0);
    max(path.rating, 10);
    min(path.durationSeconds, 0);
    min(path.year, 1900);
    max(path.year, currentYear + 1);
  });

  constructor() {
    effect(() => {
      const track = this.trackToEdit();

      if (!track) {
        return;
      }

      this.loadFailed.set(false);
      this.model.set({
        title: track.title,
        artist: track.artist,
        album: track.album ?? '',
        genre: track.genre ?? '',
        durationSeconds: track.durationSeconds ?? 0,
        year: track.year ?? currentYear,
        rating: track.rating,
        favorite: track.favorite ?? false,
        coverUrl: track.coverUrl ?? '',
      });
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.trackForm().valid()) return;

    this.saveFailed.set(false);
    this.isSaving.set(true);

    const id = this.id();
    const request =
      id === undefined || Number.isNaN(id)
        ? this.trackService.create(this.createPayload())
        : this.trackService.update(id, this.model());

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.model.set({
          title: '',
          artist: '',
          album: '',
          genre: '',
          durationSeconds: 0,
          year: currentYear,
          rating: 5,
          favorite: false,
          coverUrl: ''
        });
        this.router.navigate(['/tracks']); // B2C3K4
      },
      error: () => {
        this.isSaving.set(false);
        this.saveFailed.set(true);
      },
    });
  }

  private createPayload(): TrackPayload {
    const modelValue = this.model();
    return {
      title: modelValue.title,
      artist: modelValue.artist,
      album: modelValue.album,
      genre: modelValue.genre,
      durationSeconds: modelValue.durationSeconds,
      year: modelValue.year,
      rating: modelValue.rating,
      favorite: modelValue.favorite,
      coverUrl: modelValue.coverUrl,
    };
  }
}