import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildEntity } from '../entity/child.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ChildRepository {
  constructor(
    @InjectRepository(ChildEntity)
    private readonly repository: Repository<ChildEntity>,
  ) {}

  async createRegistration({
    cpf,
    name,
    age,
    sex,
    pai,
    mae,
  }): Promise<ChildEntity> {
    const child = this.repository.create({
      cpf,
      name,
      age,
      sex,
      pai,
      mae,
    });
    await this.repository.save(child);
    return child;
  }

  async consultByCPF(cpf: string): Promise<ChildEntity> {
    const result = await this.repository.findOneBy({ cpf });
    return result;
  }

  async findParentsByChildsCPF(cpf: string): Promise<ChildEntity> {
    const result = await this.repository.findOne({
      where: { cpf },
      relations: ['pai', 'mae'],
    });
    if (!result) {
      throw new BadRequestException('Filho não encontrado com o CPF informado');
    }
    return result;
  }

  async findAllChilden(): Promise<ChildEntity[]> {
    return await this.repository.find();
  }

  async updateRegistration(
    currentCpf: string,
    newCpf?: string,
    newName?: string,
    newAge?: number,
  ): Promise<any> {
    if (newCpf) {
      const cpfVerify = await this.consultByCPF(newCpf);
      if (cpfVerify) {
        throw new BadRequestException(
          'Falha ao atualizar os dados, esse CPF já está cadastrado.',
        );
      }
    }
    return await this.repository.update(
      { cpf: currentCpf },
      {
        cpf: newCpf,
        name: newName,
        age: newAge,
      },
    );
  }

  async deleteRegistration(conditions: any): Promise<DeleteResult> {
    const result = await this.repository.delete(conditions);
    return result;
  }
}
