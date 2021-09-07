import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Customer,
  Users,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerUsersController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/users', {
    responses: {
      '200': {
        description: 'Users belonging to Customer',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Users)},
          },
        },
      },
    },
  })
  async getUsers(
    @param.path.number('id') id: typeof Customer.prototype.id,
  ): Promise<Users> {
    return this.customerRepository.users(id);
  }
}
