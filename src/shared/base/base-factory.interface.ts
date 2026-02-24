export default interface IBaseFactory<
  TEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
> {
  createEntityFromDto(dto: TCreateDto): TEntity;
  createDetailsDtoFromEntity(entity: TEntity): TDetailsDto;
  createListDtoFromEntities(entities: TEntity[]): TListDto[];
}
