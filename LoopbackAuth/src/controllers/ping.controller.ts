import {inject} from '@loopback/context';
import {LoggingBindings, WinstonLogger} from '@loopback/logging';
import {get, Request, ResponseObject, RestBindings} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';

/**
 * OpenAPI response for ping()
 */
const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private readonly req: Request,
    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger
  ) { }

  // Map to `GET /ping`
  @authorize({permissions: ['*']})
  @get('/ping', {
    responses: {
      '200': PING_RESPONSE,
    },
  })
  ping(): object {
    this.logger.log('info', 'Get ping called');
    // Reply with a greeting, the current time, the url, and request headers
    return {
      greeting: 'Hello from LoopBack',
      date: new Date(),
      url: this.req.url,
      headers: Object.assign({}, this.req.headers),
    };
  }
}
