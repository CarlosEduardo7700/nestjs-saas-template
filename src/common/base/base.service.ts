import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  FindOptionsOrder,
} from 'typeorm';
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
    const entity: TEntity = await this.factory.createEntityFromDto(dto);

    const savedEntity: TEntity = await this.repository.save(entity);

    const entityDetails: TDetailsDto =
      this.factory.createDetailsDtoFromEntity(savedEntity);

    return entityDetails;
  }

  async findAll(
    currentPage: number,
    itemsPerPage: number,
  ): Promise<{ entitiesList: TListDto[]; totalItems: number }> {
    const skipItems: number = (currentPage - 1) * itemsPerPage;

    const queryOptions: FindManyOptions<TEntity> = {
      take: itemsPerPage,
      skip: skipItems,
      order: {
        updatedAt: 'DESC',
      } as FindOptionsOrder<TEntity>,
    };

    const [entities, totalCount]: [TEntity[], number] =
      await this.repository.findAndCount(queryOptions);

    const entitiesList: TListDto[] =
      this.factory.createListDtoFromEntities(entities);

    return { entitiesList, totalItems: totalCount };
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
      await this.factory.createUpdateDtoFromEntity(dto);

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

    await this.repository.softDelete(id);
  }
}
