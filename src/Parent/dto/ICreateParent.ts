import { ApiProperty } from '@nestjs/swagger';

export class ICreateParent {
  @ApiProperty({
    description: 'CPF do pai/mãe',
    type: String,
    example: '12345678901',
  })
  cpf: string;

  @ApiProperty({
    description: 'Nome do pai/mãe',
    type: String,
    example: 'João da Silva',
  })
  name: string;

  @ApiProperty({
    description: 'Idade do pai/mãe',
    type: Number,
    example: 35,
  })
  age: number;

  @ApiProperty({
    description: 'Parentesco dos pais em relação aos filhos',
    enum: ['pai', 'mae'],
    example: 'pai',
  })
  relationship: 'pai' | 'mae';
}
