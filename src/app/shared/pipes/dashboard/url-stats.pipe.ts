import { Pipe, PipeTransform } from '@angular/core';
import {Url} from "../../models/Url";

@Pipe({
  name: 'urlStats'
})
export class UrlStatsPipe implements PipeTransform {

  transform(urls: Url[]): string {
    let result : string = urls.length + ' / ' + urls.filter((e) => e.active).length + ' / ' + urls.filter((e) => !e.active).length;

    if (!result) {
      result = "No URLS";
    }

    return result;
  }

}
