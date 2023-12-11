import { MailerModule } from '@nestjs-modules/mailer';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { mailerConfig } from './configs/mailer.config';
import { EnsureAuthMiddleware } from './middlewares/ensureAuth.middleware';
import { EnsureIsSeller } from './middlewares/ensureIsSeller.middleware';
import { AddressesController } from './routes/addresses/addresses.controller';
import { AddressesModule } from './routes/addresses/addresses.module';
import { AnnouncementsController } from './routes/announcements/announcements.controller';
import { AnnouncementsModule } from './routes/announcements/announcements.module';
import { AuthModule } from './routes/auth/auth.module';
import { CommentsController } from './routes/comments/comments.controller';
import { CommentsModule } from './routes/comments/comments.module';
import { UsersController } from './routes/users/users.controller';
import { UsersModule } from './routes/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AddressesModule,
    AnnouncementsModule,
    CommentsModule,
    MailerModule.forRoot(mailerConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EnsureAuthMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/recover-password', method: RequestMethod.POST },
        { path: 'users/recover-password/:token', method: RequestMethod.PATCH },
        { path: 'comments/:id', method: RequestMethod.GET },
      )
      .forRoutes(UsersController, AddressesController, CommentsController);
    consumer
      .apply(EnsureAuthMiddleware, EnsureIsSeller)
      .exclude(
        { path: 'announcements', method: RequestMethod.GET },
        { path: 'announcements/:id', method: RequestMethod.GET },
        { path: 'announcements/seller/:id', method: RequestMethod.GET },
      )
      .forRoutes(AnnouncementsController);
  }
}
