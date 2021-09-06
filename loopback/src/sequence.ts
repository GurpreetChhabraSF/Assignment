import {inject} from '@loopback/core';
import {LoggingBindings, logInvocation, WinstonLogger} from '@loopback/logging';
import {MiddlewareSequence, RequestContext} from '@loopback/rest';
import * as dotenv from 'dotenv';
import Moment from 'moment';

export class MySequence extends MiddlewareSequence {

  @inject(LoggingBindings.WINSTON_LOGGER)
  private logger: WinstonLogger;

  @logInvocation()
  log(title: string, value: any) {
    console.log(title + ' ' + value);
  }

  async handle(context: RequestContext) {
    const {request, response} = context;
    const start = Moment();
    this.log('Request Time', start.format('YYYY-M-DD HH:mm:ss'));
    this.log('Referrer', request.headers.referer);
    this.log('User Agent', request.headers['user-agent']);
    this.log('Request IP', request.connection.remoteAddress);
    dotenv.config();
    if (request.headers.referer?.includes('http://localhost:3000/')
      && request.headers.referer !== process.env.ALLOWED_ORIGIN) {
      throw new Error('Origin not matched');
    }
    await super.handle(context);
    const end = Moment();
    this.log('Request End Time', end.format('YYYY-M-DD HH:mm:ss'));
    const completion = Moment.duration(Moment(end).diff(Moment(start)))
    this.log('Completion Time', completion);
  }
}
