import { Pipe, PipeTransform } from '@angular/core';
import {Url} from "../../models/Url";

@Pipe({
  name: 'urlsTotalClicks'
})
export class UrlsTotalClicksPipe implements PipeTransform {

  transform(urls: Url[]): unknown {
    return urls.map(u => u.visits);
  }

}
