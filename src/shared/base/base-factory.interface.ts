export default interface IBaseFactory<
  TEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
  TUpdateDto,
> {
  createEntityFromDto(dto: TCreateDto): TEntity;
  createDetailsDtoFromEntity(entity: TEntity): TDetailsDto;
  createListDtoFromEntities(entities: TEntity[]): TListDto[];
  createUpdateDtoFromEntity(dto: TUpdateDto): Partial<TEntity>;
}
