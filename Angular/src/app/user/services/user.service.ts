import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CrudService } from './crud.service';


@Injectable({
  providedIn: 'root'
})
export class UserService extends CrudService<User, number> {
  constructor(protected _http: HttpClient) {
    super(_http, `${environment.apiUrl}/users`);
  }
}
