import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { providers } from './providers';
import { resources } from './resources';

@Module({
  imports: [...providers, ...resources],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
