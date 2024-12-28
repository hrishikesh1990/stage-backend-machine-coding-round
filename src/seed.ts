import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);
  await seedService.seedDatabase();
  await app.close();
}

bootstrap().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
