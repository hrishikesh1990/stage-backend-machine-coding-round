import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/models/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TvshowsModule } from "src/tvshows/tvshows.module";
import { MoviesModule } from "src/movies/movies.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        TvshowsModule,
        MoviesModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [MongooseModule] 
})
export class UserModule { }