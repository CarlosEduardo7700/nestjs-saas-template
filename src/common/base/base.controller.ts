import { Delete, Get, Param, Query } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';
import { ControllerResponseDto } from './dtos/response/controller-response.dto';

export abstract class BaseController<
  TEntity extends BaseEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
  TUpdateDto,
> {
  constructor(
    private readonly baseService: BaseService<
      TEntity,
      TCreateDto,
      TDetailsDto,
      TListDto,
      TUpdateDto
    >,
  ) {}

  abstract create(dto: TCreateDto): Promise<ControllerResponseDto>;

  abstract update(id: string, dto: TUpdateDto): Promise<ControllerResponseDto>;

  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<ControllerResponseDto> {
    const currentPage: number = page || 1;
    const itemsPerPage: number = limit || 10;

    const { entitiesList, totalItems } = await this.baseService.findAll(
      currentPage,
      itemsPerPage,
    );

    return {
      message: 'Retrieved successfully!',
      data: {
        items: entitiesList,
        currentPage,
        itemsPerPage,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        totalItems,
        hasNextPage: currentPage < Math.ceil(totalItems / itemsPerPage),
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ControllerResponseDto> {
    const entityDetails: TDetailsDto = await this.baseService.findById(id);

    return {
      message: `Retrieved successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<ControllerResponseDto> {
    await this.baseService.deleteById(id);

    return {
      message: `Deleted successfully! ID: ${id}`,
    };
  }
}
