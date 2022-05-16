import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlStatsActivity'
})
export class UrlStatsActivityPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
