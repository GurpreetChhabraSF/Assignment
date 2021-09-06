import { Observable } from 'rxjs';
import { Pagination } from './user';

export interface IFindAll<T> {
  pagination: Pagination,
  data: T[]
}

export interface CrudOperations<T, ID> {
  save(t: T): Observable<T>;
  update(id: ID, t: T): Observable<T>;
  findOne(id: ID): Observable<T>;
  findAll(): Observable<T[]>;
  delete(id: ID): Observable<any>;
};