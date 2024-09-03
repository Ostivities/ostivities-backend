import { Controller, Dependencies, Get } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@Dependencies(HealthCheckService, HttpHealthIndicator)
export class HealthController {
  constructor(
    private health: { check: (arg0: (() => any)[]) => any },
    private http: {
      responseCheck(
        arg0: string,
        arg1: string,
        arg2: (res: any) => boolean,
      ): any;
      pingCheck: (arg0: string, arg1: string) => any;
    },
    private readonly disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
    private mongoose: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
    ]);
  }
  check() {
    return [
      this.health.check([
        () =>
          this.http.responseCheck(
            'ostivities-backend-syow.onrender',
            'https://ostivities-backend-syow.onrender.com',
            (res) => res.status === 204,
          ),
      ]),
      this.health.check([
        () =>
          this.disk.checkStorage('storage', {
            path: '/',
            thresholdPercent: 0.5,
          }),
      ]),
      this.health.check([
        () => this.memory.checkHeap('memory_heap', 4096 * 1024 * 1024),
      ]),
      this.health.check([async () => this.mongoose.pingCheck('mongoose')]),
    ];
  }
}
