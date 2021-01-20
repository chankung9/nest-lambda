import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'

import { configModuleOptions } from '../shared/config/module-options'
import { LoggerModule } from './logger/logger.module'
import { LoggingInterceptor } from './interceptors/logging.interceptor'
import { AllExceptionsFilter } from './filters/all-exceptions.filter'
import { TypeOrmConfigService } from './database/database'

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    LoggerModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
  exports: [ConfigModule, LoggerModule],
})
export class SharedModule { }