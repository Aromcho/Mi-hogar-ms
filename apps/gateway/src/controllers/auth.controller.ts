import { Controller, Post, Get, Req, Res, Body } from '@nestjs/common';
import { MessagingService } from '../../../../libs/messaging/src/messaging.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthGatewayController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('login')
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const response = await this.messagingService.sendMessage(
      'auth',
      { cmd: 'auth_login' },
      body,
    );

    // Seteás la cookie localmente en el Gateway
    res.cookie('token', response.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login exitoso', user: response.user };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies?.token;
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'auth_me' },
      { token },
    );
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'auth_logout' },
      {},
    );
  }

  // 🟢 GOOGLE WEB
  @Get('google/web')
  async googleWebInit(@Res() res: Response) {
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_web_init' },
      { res },
    );
  }

  @Get('google/web/callback')
  async googleWebCallback(@Req() req: Request, @Res() res: Response) {
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_web_callback' },
      { query: req.query, res },
    );
  }

  // 🔵 GOOGLE MOBILE
  @Get('google')
  async googleMobileInit(@Res() res: Response) {
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_mobile_init' },
      { res },
    );
  }

  @Get('google/callback')
  async googleMobileCallback(@Req() req: Request, @Res() res: Response) {
    return this.messagingService.sendMessage(
      'auth',
      { cmd: 'google_mobile_callback' },
      { query: req.query, res },
    );
  }
}
