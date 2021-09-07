import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CrudOperations, IFindAll } from 'src/app/interfaces/crud';
import { Pagination, UserData } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class CrudService<T, ID> implements CrudOperations<T, ID> {

  constructor(
    protected _http: HttpClient,
    @Inject(String) protected _base: string
  ) {}

  save(t: T): Observable<T> {
    return this._http.post<T>(this._base, t);
  }

  update(id: ID, t: T): Observable<T> {
    return this._http.put<T>(`${this._base}/${id}`, t, {});
  }

  findOne(id: ID): Observable<T> {
    return this._http.get<T>(`${this._base}/${id}`);
  }

  findAll(): Observable<T[]> {
    return this._http.get<T[]>(this._base);
  }

  delete(id: ID): Observable<T> {
    return this._http.delete<T>(`${this._base}/${id}`);
  }
}