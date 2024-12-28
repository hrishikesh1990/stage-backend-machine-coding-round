import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class GetWatchlistDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    limit: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    offset: number;
}

