import { BadRequestException, Injectable } from '@nestjs/common';
import { ParentEntity } from '../entity/parent.entity';
import { ParentRepository } from '../repository/parent.repository';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async createParentExecute({
    cpf,
    name,
    age,
    relationship,
  }): Promise<ParentEntity> {
    if (!/^\d{11}$/.test(cpf)) {
      throw new BadRequestException(
        'O CPF deve ter exatamente 11 dígitos numéricos.',
      );
    }
    const cpfVerify = await this.parentRepository.consultByCPF(cpf);
    if (cpfVerify) {
      throw new BadRequestException('Já existe um pai ou mãe com esse CPF');
    }
    const result = await this.parentRepository.createRegistration({
      cpf,
      name,
      age,
      relationship,
    });
    return result;
  }

  async findAllParentsExecute(): Promise<ParentEntity[]> {
    const result = await this.parentRepository.findAllParents();
    return result;
  }

  async findParentsByCpfExecute(cpf: string): Promise<ParentEntity> {
    if (!cpf) {
      throw new BadRequestException('CPF é obrigatório para a busca.');
    }
    const result = await this.parentRepository.consultByCPF(cpf);
    if (!result) {
      throw new BadRequestException(
        'Nenhum pai ou mãe encontrado com esse CPF.',
      );
    }
    return result;
  }

  async findChildrenByParentsCpfExecute(cpf: string): Promise<ParentEntity> {
    if (!cpf) {
      throw new BadRequestException('CPF é obrigatório para a busca.');
    }
    const result = await this.parentRepository.findChildrenByParentsCPF(cpf);
    if (!result) {
      throw new BadRequestException(
        'Nenhum pai ou mãe encontrado com esse CPF.',
      );
    }
    return result;
  }

  async updateParentExecute(
    currentCpf: string,
    newCpf: string,
    newName: string,
    newAge: number,
  ): Promise<ParentEntity> {
    const parent = await this.parentRepository.consultByCPF(currentCpf);
    if (!parent) {
      throw new BadRequestException(
        `Pai ou mãe com o CPF ${currentCpf} não encontrado.`,
      );
    }
    if (parent) {
      const result = await this.parentRepository.updateRegistration(
        currentCpf,
        newCpf ? newCpf : parent.cpf,
        newName ? newName : parent.name,
        newAge ? newAge : parent.age,
      );
      if (result.affected > 0) {
        return await this.parentRepository.consultByCPF(newCpf || currentCpf);
      } else {
        throw new BadRequestException('Falha ao atualizar os dados.');
      }
    }
  }

  async deleteParentExecute(cpf: string): Promise<string> {
    const parent = await this.parentRepository.consultByCPF(cpf);
    if (!parent) {
      throw new BadRequestException(
        `Pai ou mãe com o CPF ${cpf} não encontrado.`,
      );
    }
    const result = await this.parentRepository.deleteRegistration({ cpf });
    if (result.affected > 0) {
      return `Pai ou mãe com o CPF ${cpf} foi deletado com sucesso.`;
    } else {
      throw new BadRequestException('Falha ao deletar o registro.');
    }
  }
}
