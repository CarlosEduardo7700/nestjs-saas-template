import { Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { BaseService } from './base.service';
import { BaseEntity } from './base.entity';
import { ControllerResponseDto } from './dtos/response/controller-respose.dto';

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

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<ControllerResponseDto> {
    const entityDetails: TDetailsDto = await this.baseService.findById(id);

    return {
      message: `Retrieved successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: TUpdateDto,
  ): Promise<ControllerResponseDto> {
    const entityDetails: TDetailsDto = await this.baseService.update(id, dto);

    return {
      message: `Updated successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Delete('/:id')
  async deleteById(@Param('id') id: string): Promise<ControllerResponseDto> {
    await this.baseService.deleteById(id);

    return {
      message: `Deleted successfully! ID: ${id}`,
    };
  }
}
