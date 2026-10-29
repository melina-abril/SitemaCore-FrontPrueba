import { Observable, of, delay } from 'rxjs';

// Los datos mock se reemplazan al conectar el backend.
export function mockResponse<T>(data: T): Observable<T> {
  return of<T>(structuredClone(data)).pipe(delay(120));
}
