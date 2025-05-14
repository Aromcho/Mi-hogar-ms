// google-web.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleWebStrategy extends PassportStrategy(Strategy, 'google-web') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID') as string,
      clientSecret: config.get('GOOGLE_CLIENT_SECRET') as string,
      callbackURL: config.get('GOOGLE_WEB_CALLBACK_URL') as string,
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
    
  }

  async validate(
    _req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;
    const photo = profile.photos?.[0]?.value || '';
    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email,
      name: displayName,
      photo,
    });

    done(null, user);
  }
}
