import { ApiProperty } from '@nestjs/swagger';

export class IUpdateChild {
  @ApiProperty({
    description: 'Novo CPF da criança. Deve ser um número de 11 dígitos.',
    example: '98765432100',
    required: false,
  })
  newCpf?: string;

  @ApiProperty({
    description: 'Novo nome da criança.',
    example: 'Ricardo',
    required: false,
  })
  newName?: string;

  @ApiProperty({
    description: 'Nova idade da criança, em anos.',
    example: 10,
    required: false,
  })
  newAge?: number;
}
