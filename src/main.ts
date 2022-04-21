import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { utilities as nestWinstonModuleUtilities, WinstonModule } from "nest-winston";
import * as winston from "winston";

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    {
      logger: WinstonModule.createLogger(
        {
          defaultMeta: { service: "My-service-name", version: "1.0.0" },
          transports: [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                // winston.format.colorize(),
                nestWinstonModuleUtilities.format.nestLike("MyApp", { prettyPrint: true })
              )
            }),
            new winston.transports.File({
              filename: "error.log",
              level: "error",
              format: winston.format.combine(
                winston.format.timestamp({
                  format: "YYYY-MM-DD HH:mm:ss"
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                // winston.format.json(),
                winston.format.prettyPrint()
              )
            })
            // other transports...
          ]
          // other options
        }
      )
    });

  const config = new DocumentBuilder()
  .setTitle("Exchange New Structure")
  .setDescription("The exchange API description")
  .setVersion("1.0")
  .addTag("exchange")
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
