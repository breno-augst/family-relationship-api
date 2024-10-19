import { Test, TestingModule } from '@nestjs/testing';
import { ChildController } from './child.controller';
import { ChildService } from '../service/child.service';
import { ChildEntity } from '../entity/child.entity';
import { ICreateChild } from '../dto/ICreateChild';
import { IUpdateChild } from '../dto/IUpdateChild';
import { NotFoundException } from '@nestjs/common';

describe('ChildController', () => {
  let childController: ChildController;
  let childService: ChildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildController],
      providers: [
        {
          provide: ChildService,
          useValue: {
            createChildExecute: jest.fn(),
            findAllChildenExecute: jest.fn(),
            findChildByCpfExecute: jest.fn(),
            findParentsByChildsCPFExecute: jest.fn(),
            updateChildExecute: jest.fn(),
            deleteChildExecute: jest.fn(),
          },
        },
      ],
    }).compile();

    childController = module.get<ChildController>(ChildController);
    childService = module.get<ChildService>(ChildService);
  });

  it('deve criar uma criança', async () => {
    const createChildDto: ICreateChild = {
      cpf: '12345678901',
      name: 'Ana Silva',
      age: 10,
      sex: 'Feminino',
      cpfFather: '11111111111',
      cpfMother: '22222222222',
    };
    const result = new ChildEntity();
    jest.spyOn(childService, 'createChildExecute').mockResolvedValue(result);

    expect(await childController.createChildHandle(createChildDto)).toBe(
      result,
    );
    expect(childService.createChildExecute).toHaveBeenCalledWith(
      createChildDto,
    );
  });

  it('deve retornar uma lista de crianças', async () => {
    const result = [new ChildEntity()];
    jest.spyOn(childService, 'findAllChildenExecute').mockResolvedValue(result);

    expect(await childController.findAllChildenHandle()).toBe(result);
    expect(childService.findAllChildenExecute).toHaveBeenCalled();
  });

  it('deve buscar uma criança pelo CPF', async () => {
    const cpf = '12345678901';
    const result = new ChildEntity();
    jest.spyOn(childService, 'findChildByCpfExecute').mockResolvedValue(result);

    expect(await childController.findChildByCpfHandle(cpf)).toBe(result);
    expect(childService.findChildByCpfExecute).toHaveBeenCalledWith(cpf);
  });

  it('deve lançar uma exceção NotFoundException se a criança não for encontrada pelo CPF', async () => {
    const cpf = '12345678901';
    jest
      .spyOn(childService, 'findChildByCpfExecute')
      .mockRejectedValue(new NotFoundException());

    await expect(childController.findChildByCpfHandle(cpf)).rejects.toThrow(
      NotFoundException,
    );
    expect(childService.findChildByCpfExecute).toHaveBeenCalledWith(cpf);
  });

  it('deve buscar os pais pelo CPF da criança', async () => {
    const cpf = '12345678901';
    const result = new ChildEntity();
    jest
      .spyOn(childService, 'findParentsByChildsCPFExecute')
      .mockResolvedValue(result);

    expect(await childController.findParentsByChildsCPFHandle(cpf)).toBe(
      result,
    );
    expect(childService.findParentsByChildsCPFExecute).toHaveBeenCalledWith(
      cpf,
    );
  });

  it('deve atualizar os dados da criança', async () => {
    const cpf = '12345678901';
    const updateChildDto: IUpdateChild = {
      newCpf: '09876543210',
      newName: 'Ana Maria Silva',
      newAge: 11,
    };
    const result = new ChildEntity();
    jest.spyOn(childService, 'updateChildExecute').mockResolvedValue(result);

    expect(await childController.updateChildHandle(cpf, updateChildDto)).toBe(
      result,
    );
    expect(childService.updateChildExecute).toHaveBeenCalledWith(
      cpf,
      updateChildDto.newCpf,
      updateChildDto.newName,
      updateChildDto.newAge,
    );
  });

  it('deve deletar uma criança', async () => {
    const cpf = '12345678901';
    const result = 'Criança deletada com sucesso';
    jest.spyOn(childService, 'deleteChildExecute').mockResolvedValue(result);

    expect(await childController.deleteChildHandle(cpf)).toBe(result);
    expect(childService.deleteChildExecute).toHaveBeenCalledWith(cpf);
  });
});
