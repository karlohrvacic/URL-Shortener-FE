import { Pipe, PipeTransform } from '@angular/core';
import {ApiKey} from "../../models/ApiKey";
import {Url} from "../../models/Url";

@Pipe({
  name: 'getElementsForUrlByActive'
})
export class GetElementsForUrlByActivePipe implements PipeTransform {

  transform(urls: Url[], active: Boolean): Url[] {
    return urls.filter(url => url.active == active);
  }

}
