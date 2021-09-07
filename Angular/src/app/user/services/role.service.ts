import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Roles } from '../../interfaces/roles';
import { environment } from '../../../environments/environment';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends CrudService<Roles, number> {

  constructor(protected _http: HttpClient) {
    super(_http, `${environment.apiUrl}/roles`);
  }
}
