import { Repository, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from './base.entity';
import IBaseFactory from './base-factory.interface';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<
  TEntity extends BaseEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
  TUpdateDto,
> {
  constructor(
    private readonly repository: Repository<TEntity>,
    private readonly factory: IBaseFactory<
      TEntity,
      TCreateDto,
      TDetailsDto,
      TListDto,
      TUpdateDto
    >,
  ) {}

  async create(dto: TCreateDto): Promise<TDetailsDto> {
    const entity: TEntity = this.factory.createEntityFromDto(dto);

    const savedEntity: TEntity = await this.repository.save(entity);

    const entityDetails: TDetailsDto =
      this.factory.createDetailsDtoFromEntity(savedEntity);

    return entityDetails;
  }

  async findAll(): Promise<TListDto[]> {
    const entities: TEntity[] = await this.repository.find();

    const entitiesList: TListDto[] =
      this.factory.createListDtoFromEntities(entities);

    return entitiesList;
  }

  async findById(id: string): Promise<TDetailsDto> {
    const entity: TEntity | null = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<TEntity>);

    if (!entity) throw new NotFoundException('Data not found!');

    const entityDetails: TDetailsDto =
      this.factory.createDetailsDtoFromEntity(entity);

    return entityDetails;
  }

  async update(id: string, dto: TUpdateDto): Promise<TDetailsDto> {
    const entity: TEntity | null = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<TEntity>);

    if (!entity) throw new NotFoundException('Data not found!');

    const updatedData: Partial<TEntity> =
      this.factory.createUpdateDtoFromEntity(dto);

    Object.assign(entity, updatedData);

    const updatedEntity: TEntity = await this.repository.save(entity);

    const entityDetails: TDetailsDto =
      this.factory.createDetailsDtoFromEntity(updatedEntity);

    return entityDetails;
  }

  async deleteById(id: string): Promise<void> {
    const entity: TEntity | null = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<TEntity>);

    if (!entity) throw new NotFoundException('Data not found!');

    if (entity.deletedAt) throw new NotFoundException('Data already deleted!');

    await this.repository.softDelete(id);
  }
}
