import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';

@Controller()
export class AgenciesMessageController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @MessagePattern({ cmd: 'create_agency' })
  createAgency(@Payload() dto: CreateAgencyDto) {
    return this.agenciesService.create(dto);
  }

  @MessagePattern({ cmd: 'get_all_agencies' })
  getAllAgencies() {
    return this.agenciesService.findAll();
  }

  @MessagePattern({ cmd: 'get_agency_by_id' })
  getAgencyById(@Payload() id: string) {
    return this.agenciesService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_agency' })
  updateAgency(@Payload() data: { id: string; dto: UpdateAgencyDto }) {
    return this.agenciesService.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'delete_agency' })
  deleteAgency(@Payload() id: string) {
    return this.agenciesService.remove(id);
  }
}
