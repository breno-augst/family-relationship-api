import { Test, TestingModule } from '@nestjs/testing';
import { ChildService } from './child.service';
import { ChildRepository } from '../repository/child.repository';
import { ParentRepository } from '../../Parent/repository/parent.repository';
import { ChildEntity } from '../entity/child.entity';
import { BadRequestException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { ParentEntity } from 'src/Parent/entity/parent.entity';

describe('ChildService', () => {
  let childService: ChildService;
  let childRepository: ChildRepository;
  let parentRepository: ParentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        {
          provide: ChildRepository,
          useValue: {
            createRegistration: jest.fn(),
            consultByCPF: jest.fn(),
            findAllChilden: jest.fn(),
            findParentsByChildsCPF: jest.fn(),
            updateRegistration: jest.fn(),
            deleteRegistration: jest.fn(),
          },
        },
        {
          provide: ParentRepository,
          useValue: {
            consultParents: jest.fn(),
          },
        },
      ],
    }).compile();

    childService = module.get<ChildService>(ChildService);
    childRepository = module.get<ChildRepository>(ChildRepository);
    parentRepository = module.get<ParentRepository>(ParentRepository);
  });

  describe('createChildExecute', () => {
    it('deve lançar exceção se o CPF não tiver 11 dígitos', async () => {
      const childData = {
        cpf: '123456789',
        name: 'Maria',
        age: 8,
        sex: 'F',
        cpfFather: null,
        cpfMother: null,
      };

      await expect(childService.createChildExecute(childData)).rejects.toThrow(
        new BadRequestException(
          'O CPF deve ter exatamente 11 dígitos numéricos.',
        ),
      );
    });

    it('deve lançar exceção se o CPF já estiver cadastrado', async () => {
      const childData = {
        cpf: '12345678901',
        name: 'Carlos',
        age: 6,
        sex: 'M',
        cpfFather: null,
        cpfMother: null,
      };

      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue({} as ChildEntity);

      await expect(childService.createChildExecute(childData)).rejects.toThrow(
        new BadRequestException('Já existe um(a) filho(a) com esse CPF'),
      );
    });

    it('deve lançar exceção se o pai não for encontrado', async () => {
      const childData = {
        cpf: '12345678901',
        name: 'Paulo',
        age: 5,
        sex: 'M',
        cpfFather: '11111111111',
        cpfMother: null,
      };

      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);
      jest.spyOn(parentRepository, 'consultParents').mockResolvedValue(null);

      await expect(childService.createChildExecute(childData)).rejects.toThrow(
        new BadRequestException('Pai com CPF 11111111111 não encontrado.'),
      );
    });

    it('deve lançar exceção se a mãe não for encontrada', async () => {
      const childData = {
        cpf: '12345678901',
        name: 'Ana',
        age: 7,
        sex: 'F',
        cpfFather: null,
        cpfMother: '22222222222',
      };

      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);
      jest.spyOn(parentRepository, 'consultParents').mockResolvedValue(null);

      await expect(childService.createChildExecute(childData)).rejects.toThrow(
        new BadRequestException('Mãe com CPF 22222222222 não encontrada.'),
      );
    });

    it('deve criar o registro de uma criança com sucesso', async () => {
      const childData = {
        cpf: '12345678901',
        name: 'Roberto',
        age: 9,
        sex: 'M',
        cpfFather: '11111111111',
        cpfMother: '22222222222',
      };

      const mockParentPai: ParentEntity = {
        id: 1,
        cpf: '11111111111',
        name: 'Pai Teste',
        age: 40,
        relationship: 'pai',
        fatherOfChildren: [],
        motherOfChildren: [],
      };

      const mockParentMae: ParentEntity = {
        id: 2,
        cpf: '22222222222',
        name: 'Mãe Teste',
        age: 38,
        relationship: 'mae',
        fatherOfChildren: [],
        motherOfChildren: [],
      };

      const mockChild: ChildEntity = {
        id: 1,
        ...childData,
        pai: mockParentPai,
        mae: mockParentMae,
      };

      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);
      jest
        .spyOn(parentRepository, 'consultParents')
        .mockResolvedValueOnce(mockParentPai);
      jest
        .spyOn(parentRepository, 'consultParents')
        .mockResolvedValueOnce(mockParentMae);
      jest
        .spyOn(childRepository, 'createRegistration')
        .mockResolvedValue(mockChild);

      const result = await childService.createChildExecute(childData);

      expect(result).toEqual(mockChild);
      expect(childRepository.createRegistration).toHaveBeenCalledWith({
        cpf: '12345678901',
        name: 'Roberto',
        age: 9,
        sex: 'M',
        pai: mockParentPai,
        mae: mockParentMae,
      });
    });
  });

  describe('findAllChildenExecute', () => {
    it('deve retornar uma lista de crianças', async () => {
      const result = [new ChildEntity()];
      jest.spyOn(childRepository, 'findAllChilden').mockResolvedValue(result);

      expect(await childService.findAllChildenExecute()).toBe(result);
      expect(childRepository.findAllChilden).toHaveBeenCalled();
    });
  });

  describe('findChildByCpfExecute', () => {
    it('deve retornar uma criança com o CPF especificado', async () => {
      const cpf = '12345678901';
      const result = new ChildEntity();
      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(result);

      expect(await childService.findChildByCpfExecute(cpf)).toBe(result);
      expect(childRepository.consultByCPF).toHaveBeenCalledWith(cpf);
    });

    it('deve lançar uma exceção se a criança não for encontrada', async () => {
      const cpf = '12345678901';
      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(childService.findChildByCpfExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findParentsByChildsCPFExecute', () => {
    it('deve retornar os pais de uma criança com o CPF especificado', async () => {
      const cpf = '12345678901';
      const childResult = new ChildEntity();
      jest
        .spyOn(childRepository, 'findParentsByChildsCPF')
        .mockResolvedValue(childResult);

      const result = await childService.findParentsByChildsCPFExecute(cpf);

      expect(result).toBe(childResult);
      expect(childRepository.findParentsByChildsCPF).toHaveBeenCalledWith(cpf);
    });

    it('deve lançar uma exceção se o CPF não for fornecido', async () => {
      await expect(
        childService.findParentsByChildsCPFExecute(''),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar uma exceção se a criança não for encontrada', async () => {
      const cpf = '12345678901';
      jest
        .spyOn(childRepository, 'findParentsByChildsCPF')
        .mockResolvedValue(null);

      await expect(
        childService.findParentsByChildsCPFExecute(cpf),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateChildExecute', () => {
    it('deve atualizar os dados de uma criança com sucesso', async () => {
      const currentCpf = '12345678901';
      const newCpf = '09876543210';
      const newName = 'Novo Nome';
      const newAge = 12;
      const childEntity = new ChildEntity();

      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue(childEntity);
      jest
        .spyOn(childRepository, 'updateRegistration')
        .mockResolvedValue({ affected: 1 });
      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue(childEntity);

      const result = await childService.updateChildExecute(
        currentCpf,
        newCpf,
        newName,
        newAge,
      );

      expect(result).toBe(childEntity);
      expect(childRepository.consultByCPF).toHaveBeenCalledWith(currentCpf);
      expect(childRepository.updateRegistration).toHaveBeenCalledWith(
        currentCpf,
        newCpf,
        newName,
        newAge,
      );
      expect(childRepository.consultByCPF).toHaveBeenCalledWith(newCpf);
    });

    it('deve lançar uma exceção se a criança não for encontrada', async () => {
      const currentCpf = '12345678901';
      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(
        childService.updateChildExecute(
          currentCpf,
          '09876543210',
          'Novo Nome',
          12,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar uma exceção se a atualização falhar', async () => {
      const currentCpf = '12345678901';
      const newCpf = '09876543210';
      const childEntity = new ChildEntity();

      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue(childEntity);
      jest
        .spyOn(childRepository, 'updateRegistration')
        .mockResolvedValue({ affected: 0 });

      await expect(
        childService.updateChildExecute(currentCpf, newCpf, 'Novo Nome', 12),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteChildExecute', () => {
    it('deve deletar uma criança com sucesso', async () => {
      const cpf = '12345678901';
      const childEntity = new ChildEntity();

      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue(childEntity);
      jest.spyOn(childRepository, 'deleteRegistration').mockResolvedValue({
        affected: 1,
        raw: {},
      } as DeleteResult);

      const result = await childService.deleteChildExecute(cpf);

      expect(result).toBe(`Filho com o CPF ${cpf} foi deletado com sucesso.`);
      expect(childRepository.consultByCPF).toHaveBeenCalledWith(cpf);
      expect(childRepository.deleteRegistration).toHaveBeenCalledWith({ cpf });
    });

    it('deve lançar uma exceção se a criança não for encontrada', async () => {
      const cpf = '12345678901';
      jest.spyOn(childRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(childService.deleteChildExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar uma exceção se a exclusão falhar', async () => {
      const cpf = '12345678901';
      const childEntity = new ChildEntity();

      jest
        .spyOn(childRepository, 'consultByCPF')
        .mockResolvedValue(childEntity);
      jest.spyOn(childRepository, 'deleteRegistration').mockResolvedValue({
        affected: 0,
        raw: {},
      } as DeleteResult);

      await expect(childService.deleteChildExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
