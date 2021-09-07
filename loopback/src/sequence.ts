import {inject} from '@loopback/core';
import {LoggingBindings, logInvocation, WinstonLogger} from '@loopback/logging';
import {FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, RestBindings, Send, SequenceHandler} from '@loopback/rest';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import Moment from 'moment';
import {AuthClient} from './models/auth-client.model';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence implements SequenceHandler {

  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
    protected authenticateRequestClient: AuthenticateFn<AuthClient>,
    @inject(LoggingBindings.WINSTON_LOGGER)
    private logger: WinstonLogger
  ) { }

  @logInvocation()
  log(title: string, value: any) {
    console.log(title + ' ' + value);
  }

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      // Log Request Details
      const start = Moment();
      this.logReqDetails(request, start);
      // this.matchOrigin(request);

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      await this.authenticateRequestClient(request);
      const result = await this.invoke(route, args);
      this.logReqCompletionDetails(start);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }

  // async handle(context: RequestContext) {
  //   const {request, response} = context;
  //   const start = Moment();
  //   this.logReqDetails(request, start);
  //   this.matchOrigin(request);
  //   await super.handle(context);
  //   this.logReqCompletionDetails(start);
  // }

  protected logReqDetails(request: any, start: any): void {
    this.log('Request Time', start.format('YYYY-M-DD HH:mm:ss'));
    this.log('Referrer', request.headers.referer);
    this.log('User Agent', request.headers['user-agent']);
    this.log('Request IP', request.connection.remoteAddress);
  }

  protected matchOrigin(request: any) {
    if (request.headers.referer?.includes('http://localhost:3000/')
      && request.headers.referer !== process.env.ALLOWED_ORIGIN) {
      throw new Error('Origin not matched');
    }
  }

  protected logReqCompletionDetails(start: any): void {
    const end = Moment();
    this.log('Request End Time', end.format('YYYY-M-DD HH:mm:ss'));
    const completion = Moment.duration(Moment(end).diff(Moment(start)))
    this.log('Completion Time', completion);
  }
}
