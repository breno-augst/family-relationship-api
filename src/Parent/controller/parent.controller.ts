import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ParentService } from '../service/parent.service';
import { ICreateParent } from '../dto/ICreateParent';
import { ParentEntity } from '../entity/parent.entity';
import { IUpdateParent } from '../dto/IUpdateParent';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('parents')
@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post('/createParent')
  @ApiOperation({ summary: 'Cria um novo pai/mãe' })
  @ApiResponse({
    status: 201,
    description: 'Pai/mãe criado com sucesso.',
    type: ParentEntity,
  })
  async createParentHandle(
    @Body() createParent: ICreateParent,
  ): Promise<ParentEntity> {
    const { cpf, name, age, relationship } = createParent;
    const result = await this.parentService.createParentExecute({
      cpf,
      name,
      age,
      relationship,
    });
    return result;
  }

  @Get('/findAllParents')
  @ApiOperation({ summary: 'Retorna todos os pais/mães' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pais/mães.',
    type: [ParentEntity],
  })
  async findAllParentsHandle(): Promise<ParentEntity[]> {
    const result = await this.parentService.findAllParentsExecute();
    return result;
  }

  @Get('/findParentsByCPF')
  @ApiOperation({ summary: 'Encontra um pai/mãe pelo CPF' })
  @ApiResponse({
    status: 200,
    description: 'Pai/mãe encontrado.',
    type: ParentEntity,
  })
  async findParentsByCpfHandle(
    @Query('cpf') cpf: string,
  ): Promise<ParentEntity> {
    const result = await this.parentService.findParentsByCpfExecute(cpf);
    return result;
  }

  @Get('/findChildrenByParentsCPF/:cpf')
  @ApiOperation({ summary: 'Encontra filhos pelo CPF do pai/mãe' })
  @ApiResponse({
    status: 200,
    description: 'Filhos encontrados.',
    type: ParentEntity,
  })
  async findChildrenByParentsCpfHandle(
    @Param('cpf') cpf: string,
  ): Promise<ParentEntity> {
    const result =
      await this.parentService.findChildrenByParentsCpfExecute(cpf);
    return result;
  }

  @Patch('/updateParent/:cpf')
  @ApiOperation({ summary: 'Atualiza os dados de um pai/mãe' })
  @ApiResponse({
    status: 200,
    description: 'Pai/mãe atualizado com sucesso.',
    type: ParentEntity,
  })
  async updateParentHandle(
    @Param('cpf') cpf: string,
    @Body()
    updateParent: IUpdateParent,
  ): Promise<ParentEntity> {
    const { newCpf, newName, newAge } = updateParent;
    const result = await this.parentService.updateParentExecute(
      cpf,
      newCpf,
      newName,
      newAge,
    );
    return result;
  }

  @Delete('/deleteParent/:cpf')
  @ApiOperation({ summary: 'Deleta um pai/mãe pelo CPF' })
  @ApiResponse({
    status: 200,
    description: 'Pai/mãe deletado com sucesso.',
    type: String,
  })
  async deleteParentHandle(@Param('cpf') cpf: string): Promise<string> {
    const result = await this.parentService.deleteParentExecute(cpf);
    return result;
  }
}
