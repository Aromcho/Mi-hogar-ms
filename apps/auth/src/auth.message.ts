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
}
