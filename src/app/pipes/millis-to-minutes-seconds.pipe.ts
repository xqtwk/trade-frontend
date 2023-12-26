import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'millisToMinutesSeconds',
  standalone: true
})
export class MillisToMinutesSecondsPipe implements PipeTransform {

  transform(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = parseInt(((millis % 60000) / 1000).toFixed(0), 10);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

}
