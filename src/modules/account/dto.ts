import { ApiProperty } from '@nestjs/swagger';
import { AvailableStatus } from '@prisma/client';

export class CreateAccountDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty({
    enum: AvailableStatus,
  })
  status: AvailableStatus;
  @ApiProperty()
  password: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  roleId: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  password: string;
}
