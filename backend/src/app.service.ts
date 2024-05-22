import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): Boolean {
    return true;
  }
}
