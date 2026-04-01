import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/common/decorators/public.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @Public()
  @SkipThrottle()
  @HealthCheck()
  @ApiOperation({ summary: 'Full health check (DB, memory, disk)' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 5000 }),

      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),

      () =>
        this.disk.checkStorage('disk', {
          path: process.platform === 'win32' ? 'C:\\' : '/',
          thresholdPercent: 0.05,
        }),
    ]);
  }

  @Get('live')
  @Public()
  @SkipThrottle()
  @HealthCheck()
  @ApiOperation({ summary: 'Liveness probe' })
  liveness() {
    return this.health.check([]);
  }

  @Get('ready')
  @Public()
  @SkipThrottle()
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe (DB connected)' })
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 5000 }),
    ]);
  }
}
