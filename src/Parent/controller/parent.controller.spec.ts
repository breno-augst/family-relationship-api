import { Test, TestingModule } from '@nestjs/testing';
import { ParentController } from './parent.controller';
import { ParentService } from '../service/parent.service';
import { ParentEntity } from '../entity/parent.entity';
import { ICreateParent } from '../dto/ICreateParent';
import { IUpdateParent } from '../dto/IUpdateParent';
import { NotFoundException } from '@nestjs/common';

describe('ParentController', () => {
  let parentController: ParentController;
  let parentService: ParentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentController],
      providers: [
        {
          provide: ParentService,
          useValue: {
            createParentExecute: jest.fn(),
            findAllParentsExecute: jest.fn(),
            findParentsByCpfExecute: jest.fn(),
            findChildrenByParentsCpfExecute: jest.fn(),
            updateParentExecute: jest.fn(),
            deleteParentExecute: jest.fn(),
          },
        },
      ],
    }).compile();

    parentController = module.get<ParentController>(ParentController);
    parentService = module.get<ParentService>(ParentService);
  });

  it('deve criar um pai', async () => {
    const createParentDto: ICreateParent = {
      cpf: '12345678901',
      name: 'João Silva',
      age: 40,
      relationship: 'pai',
    };
    const result = new ParentEntity();
    jest.spyOn(parentService, 'createParentExecute').mockResolvedValue(result);

    expect(await parentController.createParentHandle(createParentDto)).toBe(
      result,
    );
    expect(parentService.createParentExecute).toHaveBeenCalledWith(
      createParentDto,
    );
  });

  it('deve retornar uma lista de pais', async () => {
    const result = [new ParentEntity()];
    jest
      .spyOn(parentService, 'findAllParentsExecute')
      .mockResolvedValue(result);

    expect(await parentController.findAllParentsHandle()).toBe(result);
    expect(parentService.findAllParentsExecute).toHaveBeenCalled();
  });

  it('deve buscar um pai pelo CPF', async () => {
    const cpf = '12345678901';
    const result = new ParentEntity();
    jest
      .spyOn(parentService, 'findParentsByCpfExecute')
      .mockResolvedValue(result);

    expect(await parentController.findParentsByCpfHandle(cpf)).toBe(result);
    expect(parentService.findParentsByCpfExecute).toHaveBeenCalledWith(cpf);
  });

  it('deve lançar uma exceção NotFoundException se o pai não for encontrado pelo CPF', async () => {
    const cpf = '12345678901';
    jest
      .spyOn(parentService, 'findParentsByCpfExecute')
      .mockRejectedValue(new NotFoundException());

    await expect(parentController.findParentsByCpfHandle(cpf)).rejects.toThrow(
      NotFoundException,
    );
    expect(parentService.findParentsByCpfExecute).toHaveBeenCalledWith(cpf);
  });

  it('deve buscar filhos pelo CPF dos pais', async () => {
    const cpf = '12345678901';
    const result = new ParentEntity();
    jest
      .spyOn(parentService, 'findChildrenByParentsCpfExecute')
      .mockResolvedValue(result);

    expect(await parentController.findChildrenByParentsCpfHandle(cpf)).toBe(
      result,
    );
    expect(parentService.findChildrenByParentsCpfExecute).toHaveBeenCalledWith(
      cpf,
    );
  });

  it('deve atualizar os dados do pai', async () => {
    const cpf = '12345678901';
    const updateParentDto: IUpdateParent = {
      newCpf: '09876543210',
      newName: 'João Silva',
      newAge: 41,
    };
    const result = new ParentEntity();
    jest.spyOn(parentService, 'updateParentExecute').mockResolvedValue(result);

    expect(
      await parentController.updateParentHandle(cpf, updateParentDto),
    ).toBe(result);
    expect(parentService.updateParentExecute).toHaveBeenCalledWith(
      cpf,
      updateParentDto.newCpf,
      updateParentDto.newName,
      updateParentDto.newAge,
    );
  });

  it('deve deletar um pai', async () => {
    const cpf = '12345678901';
    const result = 'Pai deletado com sucesso';
    jest.spyOn(parentService, 'deleteParentExecute').mockResolvedValue(result);

    expect(await parentController.deleteParentHandle(cpf)).toBe(result);
    expect(parentService.deleteParentExecute).toHaveBeenCalledWith(cpf);
  });
});
