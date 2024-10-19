import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChildRepository } from './child.repository';
import { ChildEntity } from '../entity/child.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

describe('ChildRepository', () => {
  let childRepository: ChildRepository;
  let repository: Repository<ChildEntity>;

  const mockChildEntity: ChildEntity = {
    id: 1,
    cpf: '12345678901',
    name: 'Roberto',
    age: 9,
    sex: 'M',
    pai: null,
    mae: null,
  };

  const mockChildRepository = {
    create: jest.fn().mockReturnValue(mockChildEntity),
    save: jest.fn().mockResolvedValue(mockChildEntity),
    findOneBy: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue({ affected: 1 } as DeleteResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildRepository,
        {
          provide: getRepositoryToken(ChildEntity),
          useValue: mockChildRepository,
        },
      ],
    }).compile();

    childRepository = module.get<ChildRepository>(ChildRepository);
    repository = module.get<Repository<ChildEntity>>(
      getRepositoryToken(ChildEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar o método findOneBy do repositório', async () => {
    mockChildRepository.findOneBy.mockResolvedValue(mockChildEntity);
    await childRepository.consultByCPF('12345678901');

    expect(repository.findOneBy).toHaveBeenCalledWith({
      cpf: '12345678901',
    });
  });

  describe('createRegistration', () => {
    it('deve criar uma nova criança com sucesso', async () => {
      const childData = {
        cpf: '12345678901',
        name: 'Roberto',
        age: 9,
        sex: 'M',
        pai: null,
        mae: null,
      };

      const result = await childRepository.createRegistration(childData);
      expect(result).toEqual(mockChildEntity);
      expect(mockChildRepository.create).toHaveBeenCalledWith(childData);
      expect(mockChildRepository.save).toHaveBeenCalledWith(mockChildEntity);
    });
  });

  describe('consultByCPF', () => {
    it('deve retornar uma criança pelo CPF', async () => {
      mockChildRepository.findOneBy.mockResolvedValue(mockChildEntity);

      const result = await childRepository.consultByCPF('12345678901');
      expect(result).toEqual(mockChildEntity);
      expect(mockChildRepository.findOneBy).toHaveBeenCalledWith({
        cpf: '12345678901',
      });
    });

    it('deve retornar null se a criança não for encontrada', async () => {
      mockChildRepository.findOneBy.mockResolvedValue(null);

      const result = await childRepository.consultByCPF('00000000000');
      expect(result).toBeNull();
      expect(mockChildRepository.findOneBy).toHaveBeenCalledWith({
        cpf: '00000000000',
      });
    });
  });

  describe('findParentsByChildsCPF', () => {
    it('deve retornar uma criança e seus pais pelo CPF', async () => {
      const mockChildWithParents = {
        ...mockChildEntity,
        pai: { id: 1, cpf: '11111111111', name: 'Pai' },
        mae: { id: 2, cpf: '22222222222', name: 'Mãe' },
      } as ChildEntity;

      mockChildRepository.findOne.mockResolvedValue(mockChildWithParents);

      const result =
        await childRepository.findParentsByChildsCPF('12345678901');
      expect(result).toEqual(mockChildWithParents);

      expect(mockChildRepository.findOne).toHaveBeenCalledWith({
        where: { cpf: '12345678901' },
        relations: ['pai', 'mae'],
      });
    });
  });
  describe('findAllChilden', () => {
    it('deve retornar todas as crianças', async () => {
      mockChildRepository.find.mockResolvedValue([mockChildEntity]);

      const result = await childRepository.findAllChilden();
      expect(result).toEqual([mockChildEntity]);
      expect(mockChildRepository.find).toHaveBeenCalled();
    });
  });

  describe('updateRegistration', () => {
    it('deve atualizar os dados da criança com sucesso', async () => {
      mockChildRepository.findOneBy.mockResolvedValue(null); // Simula que o CPF não existe

      await childRepository.updateRegistration(
        '12345678901',
        '98765432100',
        'Novo Nome',
        10,
      );
      expect(mockChildRepository.update).toHaveBeenCalledWith(
        { cpf: '12345678901' },
        {
          cpf: '98765432100',
          name: 'Novo Nome',
          age: 10,
        },
      );
    });

    it('deve lançar uma exceção se o novo CPF já estiver cadastrado', async () => {
      mockChildRepository.findOneBy.mockResolvedValue(mockChildEntity); // Simula que o CPF já existe

      await expect(
        childRepository.updateRegistration('12345678901', '12345678901'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        childRepository.updateRegistration('12345678901', '12345678901'),
      ).rejects.toThrow(
        'Falha ao atualizar os dados, esse CPF já está cadastrado.',
      );
    });
  });

  describe('deleteRegistration', () => {
    it('deve deletar a criança com sucesso', async () => {
      const result = await childRepository.deleteRegistration({
        cpf: '12345678901',
      });
      expect(result).toEqual({ affected: 1 });
      expect(mockChildRepository.delete).toHaveBeenCalledWith({
        cpf: '12345678901',
      });
    });
  });
});
