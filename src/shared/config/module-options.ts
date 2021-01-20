
import configuration from './configuration'
import * as Joi from '@hapi/joi'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('dev', 'qa', 'uat', 'prod')
      .default('dev'),
    BACKEND_APP_PORT: Joi.number().default(3000),
  }),
}