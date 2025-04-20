import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseToNumberPipe implements PipeTransform {
  transform(value: any) {
    const val = Number(value);
    if (isNaN(val)) {
      throw new BadRequestException(`El valor "${value}" no es un número válido`);
    }
    return val;
  }
}
