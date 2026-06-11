import { Component, DestroyRef, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Track } from '../models/track';
import { TrackService } from '../services/track.service';
import { AuthService } from '../services/auth.service';

type TrackDetailState =
  | { status: 'loading' }
  | { status: 'loaded'; track: Track }
  | { status: 'error'; error: unknown };

@Component({
  selector: 'app-track-detail',
  templateUrl: './track-detail.html',
  styleUrl: './track-detail.css',
})
export class TrackDetail {
  // Le paramètre de route `:id` arrive en string → converti en number (withComponentInputBinding)
  id = input.required({ transform: numberAttribute }); // R2O3U4
  protected auth = inject(AuthService);
  protected isDeleting = signal(false);
  protected deleteFailed = signal(false);

  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private service = inject(TrackService); // Q7v3K7

  private state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.service.getTrack(id).pipe(
          map((track): TrackDetailState => ({ status: 'loaded', track })),
          startWith({ status: 'loading' } satisfies TrackDetailState),
          catchError((error: unknown) =>
            of({ status: 'error', error } satisfies TrackDetailState),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } satisfies TrackDetailState },
  );

  protected track = computed(() => {
    const state = this.state();
    return state.status === 'loaded' ? state.track : null;
  });

  protected isLoading = computed(() => this.state().status === 'loading');
  protected hasError = computed(() => this.state().status === 'error');

  protected editTrack(): void {
    this.router.navigate(['/tracks', this.id(), 'edit']); // E3D4I5
  }

  protected deleteTrack(): void {
    this.deleteFailed.set(false);
    this.isDeleting.set(true);

    this.service
      .remove(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.router.navigate(['/tracks']); // R6M7V8
        },
        error: () => {
          this.isDeleting.set(false);
          this.deleteFailed.set(true);
        },
      });
  }
}