import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:3002/auth/google/redirect',
      scope: ['profile', 'email'],
      passReqToCallback: false, // ✅ SOLUCIÓN
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;

    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email,
      name: displayName,
    });

    done(null, user);
  }
}
