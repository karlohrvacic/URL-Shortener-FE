import { Pipe, PipeTransform } from '@angular/core';
import {ApiKey} from "../../models/ApiKey";

@Pipe({
  name: 'apiKeyStats'
})
export class ApiKeyStatsPipe implements PipeTransform {

  transform(apiKeys: ApiKey[]): unknown {
    let result : string = apiKeys.length + ' / ' + apiKeys.filter((e) => e.active).length + ' / ' + apiKeys.filter((e) => !e.active).length;

    if (!result) {
      result = "No API keys";
    }

    return result;
  }

}
