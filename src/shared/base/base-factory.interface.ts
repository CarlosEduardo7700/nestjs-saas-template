export default interface IBaseFactory<
  TEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
  TUpdateDto,
> {
  createEntityFromDto(dto: TCreateDto): Promise<TEntity>;
  createDetailsDtoFromEntity(entity: TEntity): TDetailsDto;
  createListDtoFromEntities(entities: TEntity[]): TListDto[];
  createUpdateDtoFromEntity(dto: TUpdateDto): Promise<Partial<TEntity>>;
}
