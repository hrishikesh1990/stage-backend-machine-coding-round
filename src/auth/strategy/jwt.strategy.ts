import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'nitesh-gupta' // process.env.JWT_SECRET_KEY, // use environment variable for the secret key
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, username: payload.username };
  }
}
