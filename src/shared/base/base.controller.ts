import { Post, Body, Get } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseEntity } from './base.entity';
import { ControllerResponseDto } from './dtos/response/controller-respose.dto';

export abstract class BaseController<
  TEntity extends BaseEntity,
  TCreateDto,
  TDetailsDto,
  TListDto,
> {
  constructor(
    private readonly baseService: BaseService<
      TEntity,
      TCreateDto,
      TDetailsDto,
      TListDto
    >,
  ) {}

  @Post()
  async create(@Body() dto: TCreateDto): Promise<ControllerResponseDto> {
    const entityDetails: TDetailsDto = await this.baseService.create(dto);

    return {
      message: 'Created successfully!',
      data: entityDetails,
    };
  }

  @Get()
  async findAll(): Promise<ControllerResponseDto> {
    const entitiesList: TListDto[] = await this.baseService.findAll();

    return {
      message: 'Retrieved successfully!',
      data: entitiesList,
    };
  }
}
