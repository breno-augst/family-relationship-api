import { Test, TestingModule } from '@nestjs/testing';
import { ParentService } from './parent.service';
import { ParentRepository } from '../repository/parent.repository';
import { ParentEntity } from '../entity/parent.entity';
import { BadRequestException } from '@nestjs/common';

describe('ParentService', () => {
  let parentService: ParentService;
  let parentRepository: ParentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentService,
        {
          provide: ParentRepository,
          useValue: {
            consultByCPF: jest.fn(),
            createRegistration: jest.fn(),
            findAllParents: jest.fn(),
            findChildrenByParentsCPF: jest.fn(),
            updateRegistration: jest.fn(),
            deleteRegistration: jest.fn(),
          },
        },
      ],
    }).compile();

    parentService = module.get<ParentService>(ParentService);
    parentRepository = module.get<ParentRepository>(ParentRepository);
  });

  describe('createParentExecute', () => {
    it('deve criar um novo pai', async () => {
      const parentData = {
        cpf: '12345678901',
        name: 'João Silva',
        age: 40,
        relationship: 'pai',
      };
      const createdParent = new ParentEntity();
      jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(null);
      jest
        .spyOn(parentRepository, 'createRegistration')
        .mockResolvedValue(createdParent);

      const result = await parentService.createParentExecute(parentData);
      expect(result).toBe(createdParent);
      expect(parentRepository.consultByCPF).toHaveBeenCalledWith(
        parentData.cpf,
      );
      expect(parentRepository.createRegistration).toHaveBeenCalledWith(
        parentData,
      );
    });

    it('deve lançar uma exceção se o CPF for inválido', async () => {
      const parentData = {
        cpf: '123456789',
        name: 'João Silva',
        age: 40,
        relationship: 'pai',
      };
      await expect(
        parentService.createParentExecute(parentData),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar uma exceção se o CPF já estiver cadastrado', async () => {
      const parentData = {
        cpf: '12345678901',
        name: 'João Silva',
        age: 40,
        relationship: 'pai',
      };
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(new ParentEntity());

      await expect(
        parentService.createParentExecute(parentData),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllParentsExecute', () => {
    it('deve retornar uma lista de pais', async () => {
      const parents = [new ParentEntity()];
      jest.spyOn(parentRepository, 'findAllParents').mockResolvedValue(parents);

      const result = await parentService.findAllParentsExecute();
      expect(result).toBe(parents);
      expect(parentRepository.findAllParents).toHaveBeenCalled();
    });
  });

  describe('findParentsByCpfExecute', () => {
    it('deve retornar um pai pelo CPF', async () => {
      const cpf = '12345678901';
      const parent = new ParentEntity();
      jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(parent);

      const result = await parentService.findParentsByCpfExecute(cpf);
      expect(result).toBe(parent);
      expect(parentRepository.consultByCPF).toHaveBeenCalledWith(cpf);
    });

    it('deve lançar uma exceção se o CPF não for fornecido', async () => {
      await expect(parentService.findParentsByCpfExecute('')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar uma exceção se o CPF não for encontrado', async () => {
      const cpf = '12345678901';
      jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(parentService.findParentsByCpfExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findChildrenByParentsCpfExecute', () => {
    it('deve retornar os filhos pelo CPF dos pais', async () => {
      const cpf = '12345678901';
      const parent = new ParentEntity();
      jest
        .spyOn(parentRepository, 'findChildrenByParentsCPF')
        .mockResolvedValue(parent);

      const result = await parentService.findChildrenByParentsCpfExecute(cpf);
      expect(result).toBe(parent);
      expect(parentRepository.findChildrenByParentsCPF).toHaveBeenCalledWith(
        cpf,
      );
    });

    it('deve lançar uma exceção se o CPF não for fornecido', async () => {
      await expect(
        parentService.findChildrenByParentsCpfExecute(''),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar uma exceção se o CPF não for encontrado', async () => {
      const cpf = '12345678901';
      jest
        .spyOn(parentRepository, 'findChildrenByParentsCPF')
        .mockResolvedValue(null);

      await expect(
        parentService.findChildrenByParentsCpfExecute(cpf),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateParentExecute', () => {
    it('deve atualizar os dados do pai', async () => {
      const currentCpf = '12345678901';
      const newCpf = '09876543210';
      const newName = 'João Silva';
      const newAge = 41;
      const updatedParent = new ParentEntity();
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(updatedParent);
      jest
        .spyOn(parentRepository, 'updateRegistration')
        .mockResolvedValue({ affected: 1 });
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(updatedParent);

      const result = await parentService.updateParentExecute(
        currentCpf,
        newCpf,
        newName,
        newAge,
      );
      expect(result).toBe(updatedParent);
      expect(parentRepository.updateRegistration).toHaveBeenCalledWith(
        currentCpf,
        newCpf,
        newName,
        newAge,
      );
    });

    it('deve lançar uma exceção se o CPF não for encontrado', async () => {
      const currentCpf = '12345678901';
      jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(
        parentService.updateParentExecute(
          currentCpf,
          '09876543210',
          'João Silva',
          41,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve lançar uma exceção se a atualização falhar', async () => {
      const currentCpf = '12345678901';
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(new ParentEntity());
      jest
        .spyOn(parentRepository, 'updateRegistration')
        .mockResolvedValue({ affected: 0 });

      await expect(
        parentService.updateParentExecute(
          currentCpf,
          '09876543210',
          'João Silva',
          41,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteParentExecute', () => {
    it('deve deletar o pai com o CPF fornecido', async () => {
      const cpf = '12345678901';
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(new ParentEntity());
      jest
        .spyOn(parentRepository, 'deleteRegistration')
        .mockResolvedValue({ affected: 1, raw: {} });

      const result = await parentService.deleteParentExecute(cpf);
      expect(result).toBe(
        `Pai ou mãe com o CPF ${cpf} foi deletado com sucesso.`,
      );
      expect(parentRepository.deleteRegistration).toHaveBeenCalledWith({ cpf });
    });

    it('deve lançar uma exceção se o CPF não for encontrado', async () => {
      const cpf = '12345678901';
      jest.spyOn(parentRepository, 'consultByCPF').mockResolvedValue(null);

      await expect(parentService.deleteParentExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar uma exceção se a exclusão falhar', async () => {
      const cpf = '12345678901';
      jest
        .spyOn(parentRepository, 'consultByCPF')
        .mockResolvedValue(new ParentEntity());
      jest
        .spyOn(parentRepository, 'deleteRegistration')
        .mockResolvedValue({ affected: 0, raw: {} });

      await expect(parentService.deleteParentExecute(cpf)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
