import { ApiProperty } from '@nestjs/swagger';

export class IUpdateParent {
  @ApiProperty({
    description:
      'Novo CPF do pai/mãe. Se não for fornecido, o CPF atual será mantido.',
    type: String,
    example: '98765432100',
    required: false,
  })
  newCpf?: string;

  @ApiProperty({
    description:
      'Novo nome do pai/mãe. Se não for fornecido, o nome atual será mantido.',
    type: String,
    example: 'Maria da Silva',
    required: false,
  })
  newName?: string;

  @ApiProperty({
    description:
      'Nova idade do pai/mãe. Se não for fornecido, a idade atual será mantida.',
    type: Number,
    example: 40,
    required: false,
  })
  newAge?: number;
}
