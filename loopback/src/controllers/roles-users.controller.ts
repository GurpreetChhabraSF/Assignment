import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Roles,
  Users,
} from '../models';
import {RolesRepository} from '../repositories';

export class RolesUsersController {
  constructor(
    @repository(RolesRepository) protected rolesRepository: RolesRepository,
  ) { }

  @get('/roles/{id}/users', {
    responses: {
      '200': {
        description: 'Roles has one Users',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Users),
          },
        },
      },
    },
  })
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Users>,
  ): Promise<Users> {
    return this.rolesRepository.users(id).get(filter);
  }

  @post('/roles/{id}/users', {
    responses: {
      '200': {
        description: 'Roles model instance',
        content: {'application/json': {schema: getModelSchemaRef(Users)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Roles.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {
            title: 'NewUsersInRoles',
            exclude: ['id'],
            optional: ['rolesId']
          }),
        },
      },
    }) users: Omit<Users, 'id'>,
  ): Promise<Users> {
    return this.rolesRepository.users(id).create(users);
  }

  @patch('/roles/{id}/users', {
    responses: {
      '200': {
        description: 'Roles.Users PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Users, {partial: true}),
        },
      },
    })
    users: Partial<Users>,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.rolesRepository.users(id).patch(users, where);
  }

  @del('/roles/{id}/users', {
    responses: {
      '200': {
        description: 'Roles.Users DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Users)) where?: Where<Users>,
  ): Promise<Count> {
    return this.rolesRepository.users(id).delete(where);
  }
}
