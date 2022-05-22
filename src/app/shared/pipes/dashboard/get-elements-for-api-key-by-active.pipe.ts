import { Pipe, PipeTransform } from '@angular/core';
import {ApiKey} from "../../models/ApiKey";

@Pipe({
  name: 'getElementsForApiKeyByActive'
})
export class GetElementsForApiKeyByActivePipe implements PipeTransform {

  transform(apiKeys: ApiKey[], active: Boolean): ApiKey[] {
    return apiKeys.filter(key => key.active == active);
  }

}
