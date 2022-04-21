import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getKey(key: string): Promise<string> {
    return await this.cacheManager.get(key);
  }

  async setKey(key: string, value: string): Promise<string>{
    return await this.cacheManager.set(key, value);
  }
}
