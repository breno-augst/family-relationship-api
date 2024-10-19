import { BadRequestException, Injectable } from '@nestjs/common';
import { ChildEntity } from '../entity/child.entity';
import { ChildRepository } from '../repository/child.repository';
import { ParentRepository } from '../../Parent/repository/parent.repository';

@Injectable()
export class ChildService {
  constructor(
    private readonly childRepository: ChildRepository,
    private readonly parentRepository: ParentRepository,
  ) {}

  async createChildExecute({
    cpf,
    name,
    age,
    sex,
    cpfFather,
    cpfMother,
  }): Promise<ChildEntity> {
    if (!/^\d{11}$/.test(cpf)) {
      throw new BadRequestException(
        'O CPF deve ter exatamente 11 dígitos numéricos.',
      );
    }
    const cpfVerify = await this.childRepository.consultByCPF(cpf);
    if (cpfVerify) {
      throw new BadRequestException('Já existe um(a) filho(a) com esse CPF');
    }

    let pai = null;
    let mae = null;
    if (cpfFather) {
      pai = await this.parentRepository.consultParents({
        cpf: cpfFather,
        relationship: 'pai',
      });
      if (!pai) {
        throw new BadRequestException(
          `Pai com CPF ${cpfFather} não encontrado.`,
        );
      }
    }
    if (cpfMother) {
      mae = await this.parentRepository.consultParents({
        cpf: cpfMother,
        relationship: 'mae',
      });
      if (!mae) {
        throw new BadRequestException(
          `Mãe com CPF ${cpfMother} não encontrada.`,
        );
      }
    }
    const result = await this.childRepository.createRegistration({
      cpf,
      name,
      age,
      sex,
      pai,
      mae,
    });
    return result;
  }

  async findAllChildenExecute(): Promise<ChildEntity[]> {
    const result = await this.childRepository.findAllChilden();
    return result;
  }

  async findChildByCpfExecute(cpf: string): Promise<ChildEntity> {
    if (!cpf) {
      throw new BadRequestException('CPF é obrigatório para a busca.');
    }
    const result = await this.childRepository.consultByCPF(cpf);
    if (!result) {
      throw new BadRequestException('Nenhum filho encontrado com esse CPF.');
    }
    return result;
  }

  async findParentsByChildsCPFExecute(cpf: string): Promise<ChildEntity> {
    if (!cpf) {
      throw new BadRequestException('CPF é obrigatório para a busca.');
    }
    const result = await this.childRepository.findParentsByChildsCPF(cpf);
    if (!result) {
      throw new BadRequestException('Nenhum filho encontrado com esse CPF.');
    }
    return result;
  }

  async updateChildExecute(
    currentCpf: string,
    newCpf: string,
    newName: string,
    newAge: number,
  ): Promise<ChildEntity> {
    const child = await this.childRepository.consultByCPF(currentCpf);
    if (!child) {
      throw new BadRequestException(
        `Filho com o CPF ${currentCpf} não encontrado.`,
      );
    }
    if (child) {
      const result = await this.childRepository.updateRegistration(
        currentCpf,
        newCpf ? newCpf : child.cpf,
        newName ? newName : child.name,
        newAge ? newAge : child.age,
      );
      if (result.affected > 0) {
        return await this.childRepository.consultByCPF(newCpf || currentCpf);
      } else {
        throw new BadRequestException('Falha ao atualizar os dados.');
      }
    }
  }

  async deleteChildExecute(cpf: string): Promise<string> {
    const child = await this.childRepository.consultByCPF(cpf);
    if (!child) {
      throw new BadRequestException(`Filho com o CPF ${cpf} não encontrado.`);
    }
    const result = await this.childRepository.deleteRegistration({ cpf });
    if (result.affected > 0) {
      return `Filho com o CPF ${cpf} foi deletado com sucesso.`;
    } else {
      throw new BadRequestException('Falha ao deletar o registro.');
    }
  }
}
