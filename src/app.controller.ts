import { Body, Controller, Get, Param, Post, UseGuards, Request } from "@nestjs/common";
import { AppService } from './app.service';
import { LocalAuthGuard } from "./auth/guards/local-auth.guard";
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { Throttle } from "@nestjs/throttler";
import { ThrottlerBehindProxyGuard } from "./throttler-behind-proxy.guard";

@Controller()
@UseGuards(ThrottlerBehindProxyGuard)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService
  ) {}

  @Throttle(3, 60)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /*@Get(':key')
  async getKey(@Param('key') key: string): Promise<string> {
    return await this.appService.getKey(key)
  }

  @Post()
  async setKey(@Body('key') key: string, @Body('value') value: string): Promise<any> {
    return await this.appService.setKey(key, value);
  }*/

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
