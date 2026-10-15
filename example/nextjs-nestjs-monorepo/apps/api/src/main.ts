import 'reflect-metadata';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import type { Response } from 'express';
import type { ErrorResponse } from '@example/contracts';
import { AppModule } from './app.module.js';

@Catch()
class ApiErrors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const parserStatus = (error as { status?: number })?.status;
    const status = error instanceof HttpException ? error.getStatus()
      : parserStatus === 415 ? 415
      : parserStatus === 400 || parserStatus === 413 ? 400 : 500;
    const errors: Record<number, [string, string]> = {
      400: ['VALIDATION_ERROR', 'Dữ liệu không hợp lệ. Tiêu đề phải có từ 1 đến 200 ký tự.'],
      404: ['NOT_FOUND', 'Không tìm thấy công việc.'],
      415: ['UNSUPPORTED_MEDIA_TYPE', 'Vui lòng gửi dữ liệu JSON.'],
      500: ['INTERNAL_ERROR', 'Không thể truy cập dữ liệu. Vui lòng thử lại.'],
    };
    const [code, message] = errors[status] ?? ['REQUEST_ERROR', 'Yêu cầu không hợp lệ.'];
    host.switchToHttp().getResponse<Response>().status(status).json({ error: { code, message } } satisfies ErrorResponse);
  }
}
async function bootstrap() {
  const origin = process.env.WEB_ORIGIN;
  try { if (!origin || new URL(origin).origin !== origin || !/^https?:/.test(origin)) throw new Error(); }
  catch { throw new Error('WEB_ORIGIN must be an HTTP(S) origin, for example http://localhost:3000.'); }
  const port = Number(process.env.PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535.');
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.enableCors({ origin: (requestOrigin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => callback(null, requestOrigin === origin), methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] });
  app.use((req: { method: string; headers: Record<string, string | undefined> }, res: Response, next: () => void) => {
    res.setHeader('Cache-Control', 'no-store');
    if (['POST', 'PATCH'].includes(req.method) && !/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] ?? '')) {
      res.status(415).json({ error: { code: 'UNSUPPORTED_MEDIA_TYPE', message: 'Vui lòng gửi dữ liệu JSON.' } } satisfies ErrorResponse);
      return;
    }
    next();
  });
  app.use(json({ strict: false }));
  app.useGlobalFilters(new ApiErrors());
  app.enableShutdownHooks();
  await app.listen(port);
}
bootstrap().catch((error: unknown) => { console.error(error instanceof Error ? error.message : 'API startup failed.'); process.exitCode = 1; });
