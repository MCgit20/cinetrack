import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Track } from '../models/track';

import { TrackForm } from './track-form';

@Component({
  template: '',
})
class BlankRoute {}

const track: Track = {
  id: 1,
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  genre: 'Synth-pop',
  durationSeconds: 200,
  year: 2019,
  rating: 9,
  favorite: true,
  coverUrl: 'https://picsum.photos/seed/1/300',
};

describe('TrackForm', () => {
  let fixture: ComponentFixture<TrackForm>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackForm],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'tracks', component: BlankRoute }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackForm);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should create a track with the API', async () => {
    fixture.detectChanges();
    fillForm('New title', 'New artist', '8');
    submitForm();

    const request = http.expectOne('http://localhost:3000/tracks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(
      expect.objectContaining({
        title: 'New title',
        artist: 'New artist',
        rating: 8,
      }),
    );

    request.flush({ ...track, title: 'New title', artist: 'New artist', rating: 8 });
    await fixture.whenStable();
  });

  it('should update an existing track with the API', async () => {
    fixture.componentRef.setInput('id', track.id);
    fixture.detectChanges();

    http.expectOne('http://localhost:3000/tracks/1').flush(track);
    await fixture.whenStable();
    fixture.detectChanges();

    fillForm('Updated title', 'Updated artist', '7');
    submitForm();

    const request = http.expectOne('http://localhost:3000/tracks/1');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      title: 'Updated title',
      artist: 'Updated artist',
      rating: 7,
    });

    request.flush({ ...track, title: 'Updated title', artist: 'Updated artist', rating: 7 });
    await fixture.whenStable();
  });

  function fillForm(title: string, artist: string, rating: string): void {
    const inputs = fixture.nativeElement.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    setInputValue(inputs[0], title);
    setInputValue(inputs[1], artist);
    setInputValue(inputs[2], rating);
    fixture.detectChanges();
  }

  function setInputValue(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function submitForm(): void {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }
});
