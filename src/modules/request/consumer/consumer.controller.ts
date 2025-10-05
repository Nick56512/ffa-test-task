import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RequestService } from '../request.service';
import { RequestStatus } from '../entities/request.entity';

@Controller()
export class ConsumerController {
  private logger: Logger;
  constructor(private readonly requestService: RequestService) {
    this.logger = new Logger('Consumer');
  }

  @EventPattern('update_status')
  public updateStatus(@Payload() requestId: string) {
    this.logger.log(`🎯 Отримано заявку з ID: ${requestId}`);

    setTimeout(async () => {
      await this.requestService.updateStatus(
        requestId,
        RequestStatus.InProgress,
      );
      setTimeout(async () => {
        await this.requestService.updateStatus(requestId, RequestStatus.Done);
      }, 5000);
    }, 5000);
  }
}
