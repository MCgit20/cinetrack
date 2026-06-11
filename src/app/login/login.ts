import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  protected email = signal('');
  protected password = signal('');
  protected error = signal(false);

  submit() {
    this.auth.login(this.email(), this.password()).subscribe({
      next: () => this.router.navigateByUrl('/tracks'),
      error: () => this.error.set(true),
    });
  }
}