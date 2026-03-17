import { Delete, Get, Req } from '@nestjs/common';
import type { AuthRequest } from 'src/modules/auth/interface/auth-request.interface';
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

  abstract update(
    request: AuthRequest,
    dto: TUpdateDto,
  ): Promise<ControllerResponseDto>;

  @Get()
  async findAll(): Promise<ControllerResponseDto> {
    const entitiesList: TListDto[] = await this.baseService.findAll();

    return {
      message: 'Retrieved successfully!',
      data: entitiesList,
    };
  }

  @Get('/details')
  async findById(@Req() request: AuthRequest): Promise<ControllerResponseDto> {
    const id: string = request.userData.sub;
    const entityDetails: TDetailsDto = await this.baseService.findById(id);

    return {
      message: `Retrieved successfully! ID: ${id}`,
      data: entityDetails,
    };
  }

  @Delete()
  async deleteById(
    @Req() request: AuthRequest,
  ): Promise<ControllerResponseDto> {
    const id: string = request.userData.sub;
    await this.baseService.deleteById(id);

    return {
      message: `Deleted successfully! ID: ${id}`,
    };
  }
}
