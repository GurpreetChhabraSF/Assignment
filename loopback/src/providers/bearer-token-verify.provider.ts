import {Provider} from '@loopback/context';
import {verify} from 'jsonwebtoken';
import {VerifyFunction} from 'loopback4-authentication';
import {AuthUser} from '../models/auth-user.model';


export class BearerTokenVerifyProvider
  implements Provider<VerifyFunction.BearerFn> {
  constructor() { }

  value(): VerifyFunction.BearerFn {
    return async (token) => {
      // if (token && (await this.revokedTokenRepository.get(token))) {
      //   throw new HttpErrors.Unauthorized('Token Revoked');
      // }
      const user = verify(token, process.env.JWT_SECRET as string, {
        issuer: process.env.JWT_ISSUER,
      }) as AuthUser;
      return user;
    };
  }
}

function RevokedTokenRepository(RevokedTokenRepository: any) {
  throw new Error('Function not implemented.');
}
