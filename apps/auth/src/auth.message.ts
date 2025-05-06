import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthMessageController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async handleLogin(@Payload() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    const { access_token } = await this.authService.login(user);
    return { access_token, user };
  }

  @MessagePattern({ cmd: 'auth_me' })
  async me(@Payload() data: { token: string }) {
    return await this.authService.verifyToken(data.token);
  }

  @MessagePattern({ cmd: 'auth_logout' })
  async logout() {
    return { message: 'Logout exitoso' };
  }

  @MessagePattern({ cmd: 'google_web_init' })
  googleWebInit() {
    const redirectUri = process.env.GOOGLE_WEB_CALLBACK_URL || 'http://localhost:4000/auth/google/web/callback';

    const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID || '');
    redirectUrl.searchParams.set('redirect_uri', redirectUri);
    redirectUrl.searchParams.set('response_type', 'code');
    redirectUrl.searchParams.set('scope', 'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile');
    redirectUrl.searchParams.set('access_type', 'offline');
    redirectUrl.searchParams.set('prompt', 'consent');

    console.log('Redirect URL:', redirectUrl.toString());

    return { redirectUrl: redirectUrl.toString() };
  }




  @MessagePattern({ cmd: 'google_mobile_init' })
  googleMobileInit() {
    const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID || '');
    redirectUrl.searchParams.set('redirect_uri', process.env.GOOGLE_CALLBACK_URL || '');
    redirectUrl.searchParams.set('response_type', 'code');
    redirectUrl.searchParams.set('scope', 'openid email profile');
    redirectUrl.searchParams.set('access_type', 'offline');
    redirectUrl.searchParams.set('prompt', 'consent');

    return { redirectUrl: redirectUrl.toString() };
  }

  @MessagePattern({ cmd: 'google_web_callback' })
  async googleWebCallback(@Payload() data: { code: string; state?: string }) {
    const user = await this.authService.handleGoogleCallback(data.code);
    const token = await this.authService.generateToken(user);

    return {
      token,
      name: encodeURIComponent(user.name),
      userId: user._id || user.id,
    };
  }
}
