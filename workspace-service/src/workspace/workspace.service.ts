import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceService {
  getHello() {
    return 'Hello from Workspace Service!';
  }
}
