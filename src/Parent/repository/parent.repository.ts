import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParentEntity } from '../entity/parent.entity';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ParentRepository {
  constructor(
    @InjectRepository(ParentEntity)
    private readonly repository: Repository<ParentEntity>,
  ) {}

  async createRegistration({
    cpf,
    name,
    age,
    relationship,
  }): Promise<ParentEntity> {
    const parent = this.repository.create({
      cpf,
      name,
      age,
      relationship,
    });
    await this.repository.save(parent);
    return parent;
  }

  async consultByCPF(cpf: string): Promise<ParentEntity> {
    const result = await this.repository.findOneBy({ cpf });
    return result;
  }

  async consultParents(
    conditions: FindOptionsWhere<ParentEntity>,
  ): Promise<ParentEntity | null> {
    const result = await this.repository.findOne({ where: conditions });
    return result || null;
  }

  async findAllParents(): Promise<ParentEntity[]> {
    return await this.repository.find();
  }

  async findChildrenByParentsCPF(cpf: string): Promise<ParentEntity> {
    const result = await this.repository.findOne({
      where: { cpf },
      relations: ['fatherOfChildren', 'motherOfChildren'],
    });
    if (!result) {
      throw new BadRequestException(
        'Pai ou mãe não encontrado com o CPF informado',
      );
    }
    return result;
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
