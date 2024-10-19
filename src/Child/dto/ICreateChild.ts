import { ApiProperty } from '@nestjs/swagger';

export class ICreateChild {
  @ApiProperty({
    description: 'CPF da criança, deve ser um número de 11 dígitos.',
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'Nome da criança.',
    example: 'Roberto',
  })
  name: string;

  @ApiProperty({
    description: 'Idade da criança, em anos.',
    example: 9,
  })
  age: number;

  @ApiProperty({
    description: 'Sexo da criança, deve ser "Masculino" ou "Feminino".',
    example: 'Masculino',
  })
  sex: string;

  @ApiProperty({
    description: 'CPF do pai da criança, deve ser um número de 11 dígitos.',
    example: '12345678901',
  })
  cpfFather: string;

  @ApiProperty({
    description: 'CPF da mãe da criança, deve ser um número de 11 dígitos.',
    example: '12345678901',
  })
  cpfMother: string;
}
