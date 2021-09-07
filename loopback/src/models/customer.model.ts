import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Users} from './users.model';

@model({
  settings: {
    foreignKeys: {
      fk_roles_rolesId: {
        name: 'fk_customer_usersid',
        entity: 'Users',
        entityKey: 'id',
        foreignKey: 'usersid',
      },
    }
  }
})
export class Customer extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
  })
  address?: string;

  @property({
    type: 'string',
    required: true,
  })
  website: string;

  @belongsTo(() => Users)
  usersId: number;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
