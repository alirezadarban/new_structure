import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':key')
  async getKey(@Param('key') key: string): Promise<string> {
    return await this.appService.getKey(key)
  }

  @Post()
  async setKey(@Body('key') key: string, @Body('value') value: string): Promise<any> {
    return await this.appService.setKey(key, value);
  }
}
