import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Controller()
export class PropertiesMessageController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @MessagePattern({ cmd: 'get_all_properties' })
  findAll() {
    return this.propertiesService.findAll();
  }

  @MessagePattern({ cmd: 'get_property_by_id' })
  findOne(id: string) {
    return this.propertiesService.findOne(id);
  }

  @MessagePattern({ cmd: 'get_properties_by_agent' })
  findByAgentId(agentId: string) {
    return this.propertiesService.findByAgentId(agentId);
  }

  @MessagePattern({ cmd: 'get_properties_by_branch' })
  findByBranchId(data: { id: string; page: number; limit: number }) {
    return this.propertiesService.findByBranchId(data.id, data.page, data.limit);
  }

  @MessagePattern({ cmd: 'create_property' })
  create(data: { user: any; dto: CreatePropertyDto }) {
    return this.propertiesService.createWithUser(data.user, data.dto);
  }

  @MessagePattern({ cmd: 'update_property' })
  update(data: { id: string; user: any; dto: UpdatePropertyDto }) {
    return this.propertiesService.updateWithUser(data.id, data.user, data.dto);
  }

  @MessagePattern({ cmd: 'delete_property' })
  delete(data: { id: string; user: any }) {
    return this.propertiesService.deleteWithUser(data.id, data.user);
  }
}
