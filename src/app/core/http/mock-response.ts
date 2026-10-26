import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Respuesta mock; se reemplaza al conectar el backend. */
export function mockResponse<T>(data: T): Observable<T> {
  return of(data).pipe(delay(180));
}
