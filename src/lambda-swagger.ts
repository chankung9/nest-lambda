import { APIGatewayProxyHandler } from 'aws-lambda'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Server } from 'http'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ExpressAdapter } from '@nestjs/platform-express'
import { createServer, proxy } from 'aws-serverless-express'
import { eventContext } from 'aws-serverless-express/middleware'
import * as express from 'express'
import { ConfigService } from '@nestjs/config'
import { AppLogger } from './shared/logger/logger.service'

let cachedServer: Server

const bootstrapServer = async (): Promise<Server> => {
  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)

  const app = await NestFactory.create(AppModule, adapter, {
    logger: false,
  })
  app.useLogger(new AppLogger())

  app.use(eventContext())
  app.enableCors()
  // app.setGlobalPrefix('live');

  const configService = app.get(ConfigService)
  const title = configService.get('APP_TITLE')
  const description = configService.get('APP_DESCRIPTION')
  const version = configService.get('APP_VERSION')

  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addServer('/live')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('swagger', app, document)

  await app.init()
  return createServer(expressApp)
}

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    const server = await bootstrapServer()
    cachedServer = server
    return proxy(server, event, context, 'PROMISE').promise
  } else {
    return proxy(cachedServer, event, context, 'PROMISE').promise
  }
}
