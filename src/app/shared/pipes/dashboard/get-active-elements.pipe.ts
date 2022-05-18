import { Pipe, PipeTransform } from '@angular/core';
import {ApiKey} from "../../models/ApiKey";

@Pipe({
  name: 'getActiveElementsForApiKey'
})
export class GetActiveElementsForApiKeyPipe implements PipeTransform {

  transform(model: ApiKey[]): ApiKey[] {
    return model.filter(m => m.active);
  }

}
