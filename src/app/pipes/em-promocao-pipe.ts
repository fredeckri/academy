import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emPromocao',
  standalone: true
})
export class EmPromocaoPipe implements PipeTransform {

  transform(value: number, discountPercentage: number = 15): number {
    if (isNaN(value) || isNaN(discountPercentage)) {
      return value;
    }
    const discountAmount = value * (discountPercentage / 100);
    return value - discountAmount;
  }

}