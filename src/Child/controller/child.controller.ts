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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ChildService } from '../service/child.service';
import { ChildEntity } from '../entity/child.entity';
import { ICreateChild } from '../dto/ICreateChild';
import { IUpdateChild } from '../dto/IUpdateChild';

@ApiTags('Children')
@Controller('children')
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Post('/createChild')
  @ApiOperation({ summary: 'Criar uma nova criança' })
  @ApiResponse({
    status: 201,
    description: 'Criança criada com sucesso.',
    type: ChildEntity,
  })
  @ApiBody({ type: ICreateChild })
  async createChildHandle(
    @Body() createChild: ICreateChild,
  ): Promise<ChildEntity> {
    const { cpf, name, age, sex, cpfFather, cpfMother } = createChild;
    const result = await this.childService.createChildExecute({
      cpf,
      name,
      age,
      sex,
      cpfFather,
      cpfMother,
    });
    return result;
  }

  @Get('/findAllChildren')
  @ApiOperation({ summary: 'Encontrar todas as crianças' })
  @ApiResponse({
    status: 200,
    description: 'Lista de crianças encontradas.',
    type: [ChildEntity],
  })
  async findAllChildenHandle(): Promise<ChildEntity[]> {
    const result = await this.childService.findAllChildenExecute();
    return result;
  }

  @Get('/findChildByCPF')
  @ApiOperation({ summary: 'Encontrar criança pelo CPF' })
  @ApiResponse({
    status: 200,
    description: 'Criança encontrada.',
    type: ChildEntity,
  })
  @ApiResponse({ status: 404, description: 'Criança não encontrada.' })
  async findChildByCpfHandle(@Query('cpf') cpf: string): Promise<ChildEntity> {
    const result = await this.childService.findChildByCpfExecute(cpf);
    return result;
  }

  @Get('/findParentsByChildsCPF/:cpf')
  @ApiOperation({ summary: 'Encontrar pais pelo CPF da criança' })
  @ApiResponse({
    status: 200,
    description: 'Pais encontrados.',
    type: ChildEntity,
  })
  @ApiParam({ name: 'cpf', required: true, description: 'CPF da criança' })
  async findParentsByChildsCPFHandle(
    @Param('cpf') cpf: string,
  ): Promise<ChildEntity> {
    const result = await this.childService.findParentsByChildsCPFExecute(cpf);
    return result;
  }

  @Patch('/updateChild/:cpf')
  @ApiOperation({ summary: 'Atualizar informações da criança' })
  @ApiResponse({
    status: 200,
    description: 'Criança atualizada com sucesso.',
    type: ChildEntity,
  })
  @ApiResponse({ status: 404, description: 'Criança não encontrada.' })
  @ApiBody({ type: IUpdateChild })
  @ApiParam({
    name: 'cpf',
    required: true,
    description: 'CPF da criança a ser atualizada',
  })
  async updateChildHandle(
    @Param('cpf') cpf: string,
    @Body() updateChild: IUpdateChild,
  ): Promise<ChildEntity> {
    const { newCpf, newName, newAge } = updateChild;
    const result = await this.childService.updateChildExecute(
      cpf,
      newCpf,
      newName,
      newAge,
    );
    return result;
  }

  @Delete('/deleteChild/:cpf')
  @ApiOperation({ summary: 'Deletar uma criança pelo CPF' })
  @ApiResponse({ status: 200, description: 'Criança deletada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Criança não encontrada.' })
  @ApiParam({
    name: 'cpf',
    required: true,
    description: 'CPF da criança a ser deletada',
  })
  async deleteChildHandle(@Param('cpf') cpf: string): Promise<string> {
    const result = await this.childService.deleteChildExecute(cpf);
    return result;
  }
}
