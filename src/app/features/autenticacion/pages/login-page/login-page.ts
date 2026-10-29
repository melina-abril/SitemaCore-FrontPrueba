import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CurrentUser } from '../../../../core/session/current-user';
import { AutenticacionService } from '../../data-access/autenticacion.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  private readonly auth = inject(AutenticacionService);
  private readonly session = inject(CurrentUser);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly localAttempts = new Map<string, number>();

  protected readonly form = new FormGroup({
    usuario: new FormControl('', { nonNullable: true }),
    contrasena: new FormControl('', { nonNullable: true }),
  });
  protected readonly submitting = signal(false);
  protected readonly errorTitle = signal<string | null>(null);
  protected readonly errorDetail = signal<string | null>(null);
  protected readonly notice = signal<string | null>(
    this.route.snapshot.queryParamMap.get('expired') === 'true'
      ? 'Tu sesión venció por inactividad. Ingresá nuevamente'
      : this.route.snapshot.queryParamMap.get('closed') === 'true'
        ? 'Sesión cerrada'
        : null,
  );

  protected submit(): void {
    if (this.submitting()) return;

    const usuario = this.form.controls.usuario.value.trim();
    const contrasena = this.form.controls.contrasena.value;
    this.errorTitle.set(null);
    this.errorDetail.set(null);
    this.notice.set(null);

    if (!usuario || !contrasena) {
      this.errorTitle.set('Completá usuario y contraseña para ingresar');
      return;
    }

    this.submitting.set(true);
    this.auth.login({ usuario, contrasena })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.localAttempts.delete(usuario);
          this.session.start({ token: response.token, usuario, nombre: response.nombre, rol: response.rol });
          this.submitting.set(false);
          void this.router.navigate(['/']);
        },
        error: (error: unknown) => {
          this.submitting.set(false);
          if (error instanceof HttpErrorResponse && error.status === 423) {
            this.errorTitle.set('Usuario bloqueado. Solicitá a un supervisor que lo desbloquee');
          } else if (error instanceof HttpErrorResponse && error.status === 401) {
            const localCount = (this.localAttempts.get(usuario) ?? 0) + 1;
            this.localAttempts.set(usuario, localCount);
            const attempts = this.auth.failedAttempts(usuario) ?? localCount;
            this.errorTitle.set('Usuario o contraseña incorrectos');
            this.errorDetail.set(`Revisá los datos e intentá nuevamente. Intento fallido ${Math.min(attempts, 5)} de 5.`);
          } else {
            this.errorTitle.set('No se pudo verificar el acceso. Intentá nuevamente');
          }
        },
      });
  }
}
