import {inject} from '@loopback/core';
import {LoggingBindings, logInvocation, WinstonLogger} from '@loopback/logging';
import {FindRoute, InvokeMethod, MiddlewareSequence, ParseParams, Reject, RequestContext, RestBindings, Send} from '@loopback/rest';
import {AuthClient} from '@sourceloop/authentication-service';
import * as dotenv from 'dotenv';
import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
import Moment from 'moment';

const SequenceActions = RestBindings.SequenceActions;

export class MySequence extends MiddlewareSequence {

  @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute;
  @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams;
  @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod;
  @inject(SequenceActions.SEND) public send: Send;
  @inject(SequenceActions.REJECT) public reject: Reject;
  @inject(AuthenticationBindings.CLIENT_AUTH_ACTION)
  protected authenticateRequestClient: AuthenticateFn<AuthClient>;
  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;
  @logInvocation()
  log(title: string, value: any) {
    console.log(title + ' ' + value);
  }

  async handle(context: RequestContext) {
    this.logger.log('info', `greeting`);
    try {
      const {request, response} = context;
      // Log Request Details
      const start = Moment();
      this.logReqDetails(request, start);
      this.matchOrigin(request);

      const route = this.findRoute(request);
      const args = await this.parseParams(request, route);
      request.body = args[args.length - 1];
      const auth = await this.authenticateRequestClient(request);
      console.log(auth);
      const result = await this.invoke(route, args);
      this.logReqCompletionDetails(start);
      this.send(response, result);
    } catch (err) {
      this.reject(context, err);
    }
  }

  private logReqDetails(request: any, start: any): void {
    this.log('Request Time', start.format('YYYY-M-DD HH:mm:ss'));
    this.log('Referrer', request.headers.referer);
    this.log('User Agent', request.headers['user-agent']);
    this.log('Request IP', request.connection.remoteAddress);
  }

  private matchOrigin(request: any) {
    dotenv.config(); if (request.headers.referer && (request.headers.referer?.indexOf('http://localhost:3000/') === -1
      && request.headers.referer !== process.env.ALLOWED_ORIGIN)) {
      throw new Error('Origin not matched');
    }
  }

  private logReqCompletionDetails(start: any): void {
    const end = Moment();
    this.log('Request End Time', end.format('YYYY-M-DD HH:mm:ss'));
    const completion = Moment.duration(Moment(end).diff(Moment(start)))
    this.log('Completion Time', completion);
  }
}
