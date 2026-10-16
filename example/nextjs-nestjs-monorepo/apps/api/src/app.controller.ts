import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Inject, Param, Patch, Post } from '@nestjs/common';
import type { TaskResponse, TasksResponse, UpdateTaskRequest } from '@example/contracts';
import { TasksService } from './tasks.service.js';

function validate(body: unknown, create: boolean): UpdateTaskRequest {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new BadRequestException();
  const input = body as Record<string, unknown>;
  const keys = Object.keys(input);
  if (!keys.length || keys.some((key) => !(create ? ['title'] : ['title', 'completed']).includes(key))) throw new BadRequestException();
  const result: UpdateTaskRequest = {};
  if ('title' in input) {
    if (typeof input.title !== 'string') throw new BadRequestException();
    const title = input.title.trim();
    if ([...title].length < 1 || [...title].length > 200) throw new BadRequestException();
    result.title = title;
  } else if (create) throw new BadRequestException();
  if ('completed' in input) {
    if (typeof input.completed !== 'boolean') throw new BadRequestException();
    result.completed = input.completed;
  }
  return result;
}
@Controller('api/tasks')
export class AppController {
  constructor(@Inject(TasksService) private readonly tasks: TasksService) {}
  @Get() list(): TasksResponse { return { tasks: this.tasks.list() }; }
  @Post() create(@Body() body: unknown): TaskResponse { return { task: this.tasks.create(validate(body, true).title!) }; }
  @Patch(':id') update(@Param('id') id: string, @Body() body: unknown): TaskResponse { return { task: this.tasks.update(id, validate(body, false)) }; }
  @Delete(':id') @HttpCode(204) delete(@Param('id') id: string) { this.tasks.delete(id); }
}
