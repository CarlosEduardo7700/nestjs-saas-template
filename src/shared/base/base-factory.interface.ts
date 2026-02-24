export default interface IBaseFactory<TEntity, TCreateDto, TDetailsDto> {
  createEntityFromDto(dto: TCreateDto): TEntity;
  createDetailsDtoFromEntity(entity: TEntity): TDetailsDto;
}
