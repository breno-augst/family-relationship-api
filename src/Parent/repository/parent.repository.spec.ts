import { Test, TestingModule } from '@nestjs/testing';
import { ParentRepository } from './parent.repository';
import { ParentEntity } from '../entity/parent.entity';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

describe('ParentRepository', () => {
  let parentRepository: ParentRepository;
  let repository: Repository<ParentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentRepository,
        {
          provide: getRepositoryToken(ParentEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    parentRepository = module.get<ParentRepository>(ParentRepository);
    repository = module.get<Repository<ParentEntity>>(
      getRepositoryToken(ParentEntity),
    );
  });

  it('deve criar um registro de pai', async () => {
    const parentData = {
      cpf: '12345678901',
      name: 'João Silva',
      age: 40,
      relationship: 'pai',
    };
    const parentEntity = new ParentEntity();
    jest.spyOn(repository, 'create').mockReturnValue(parentEntity);
    jest.spyOn(repository, 'save').mockResolvedValue(parentEntity);

    const result = await parentRepository.createRegistration(parentData);
    expect(result).toBe(parentEntity);
    expect(repository.create).toHaveBeenCalledWith(parentData);
    expect(repository.save).toHaveBeenCalledWith(parentEntity);
  });

  it('deve consultar um pai pelo CPF', async () => {
    const cpf = '12345678901';
    const parentEntity = new ParentEntity();
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(parentEntity);

    const result = await parentRepository.consultByCPF(cpf);
    expect(result).toBe(parentEntity);
    expect(repository.findOneBy).toHaveBeenCalledWith({ cpf });
  });

  it('deve consultar pais com condições específicas', async () => {
    const conditions = { name: 'João Silva' };
    const parentEntity = new ParentEntity();
    jest.spyOn(repository, 'findOne').mockResolvedValue(parentEntity);

    const result = await parentRepository.consultParents(conditions);
    expect(result).toBe(parentEntity);
    expect(repository.findOne).toHaveBeenCalledWith({ where: conditions });
  });

  it('deve lançar um erro ao tentar encontrar filhos pelo CPF quando o pai ou mãe não é encontrado', async () => {
    const cpf = '12345678901';
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(
      parentRepository.findChildrenByParentsCPF(cpf),
    ).rejects.toThrow(BadRequestException);
    expect(repository.findOne).toHaveBeenCalledWith({
      where: { cpf },
      relations: ['fatherOfChildren', 'motherOfChildren'],
    });
  });

  it('deve atualizar o registro do pai', async () => {
    const currentCpf = '12345678901';
    const updateData = {
      newCpf: '09876543210',
      newName: 'Carlos Silva',
      newAge: 41,
    };
    const updateResult: UpdateResult = {
      affected: 1,
      raw: {},
      generatedMaps: [],
    };
    jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(null);
    jest.spyOn(repository, 'update').mockResolvedValue(updateResult);

    const result = await parentRepository.updateRegistration(
      currentCpf,
      updateData.newCpf,
      updateData.newName,
      updateData.newAge,
    );

    expect(result).toBe(updateResult);
    expect(repository.update).toHaveBeenCalledWith(
      { cpf: currentCpf },
      {
        cpf: updateData.newCpf,
        name: updateData.newName,
        age: updateData.newAge,
      },
    );
  });

  it('deve lançar um erro ao tentar atualizar para um CPF já existente', async () => {
    const currentCpf = '12345678901';
    const newCpf = '09876543210';
    const parentEntity = new ParentEntity();
    jest
      .spyOn(parentRepository, 'consultByCPF')
      .mockResolvedValue(parentEntity);

    await expect(
      parentRepository.updateRegistration(currentCpf, newCpf),
    ).rejects.toThrow(BadRequestException);
    expect(parentRepository.consultByCPF).toHaveBeenCalledWith(newCpf);
  });

  it('deve deletar um registro de pai', async () => {
    const conditions = { cpf: '12345678901' };
    const deleteResult = { affected: 1, raw: {} };
    jest.spyOn(repository, 'delete').mockResolvedValue(deleteResult);

    const result = await parentRepository.deleteRegistration(conditions);
    expect(result).toBe(deleteResult);
    expect(repository.delete).toHaveBeenCalledWith(conditions);
  });
});
