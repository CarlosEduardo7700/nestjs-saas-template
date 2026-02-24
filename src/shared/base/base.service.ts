import { Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import IBaseFactory from './base-factory.interface';

export abstract class BaseService<
  TEntity extends BaseEntity,
  TCreateDto,
  TDetailsDto,
> {
  constructor(
    private readonly repository: Repository<TEntity>,
    private readonly factory: IBaseFactory<TEntity, TCreateDto, TDetailsDto>,
  ) {}

  async create(dto: TCreateDto): Promise<TDetailsDto> {
    const entity: TEntity = this.factory.createEntityFromDto(dto);

    const savedEntity: TEntity = await this.repository.save(entity);

    const entityDetails: TDetailsDto =
      this.factory.createDetailsDtoFromEntity(savedEntity);

    return entityDetails;
  }
}
