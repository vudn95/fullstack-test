import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class CreateUserDto {
  @ApiProperty({ required: true, default: '123456' })
  @IsNotEmpty({
    message: 'firstName:ShouldNotBeEmpty',
  })
  password: string;

  @ApiProperty({ default: 'abc@gmail.com' })
  @IsEmail(
    {},
    {
      message: 'email:MustBeEmail',
    },
  )
  email: string;

  @ApiProperty({ required: true, default: 'david' })
  @IsNotEmpty({
    message: 'firstName:ShouldNotBeEmpty',
  })
  firstName: string;

  @ApiProperty({ required: true, default: 'ben' })
  @IsNotEmpty({
    message: 'lastName:ShouldNotBeEmpty',
  })
  lastName: string;
}

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty({
    message: 'email:ShouldNotBeEmpty',
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'password:ShouldNotBeEmpty',
  })
  password: string;
}
