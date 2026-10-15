import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { TasksService } from './tasks.service.js';
@Module({ controllers: [AppController], providers: [TasksService] })
export class AppModule {}
