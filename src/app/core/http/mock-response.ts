import { of, type Observable } from 'rxjs';
import { delay } from 'rxjs';

// Respuesta mock temporal: reemplazar al conectar el backend.
export function mockResponse<T>(data: T): Observable<T> {
  return of(data).pipe(delay(200));
}
