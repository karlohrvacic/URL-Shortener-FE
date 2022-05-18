import { Pipe, PipeTransform } from '@angular/core';
import {Url} from "../../models/Url";

@Pipe({
  name: 'getActiveElementsForUrl'
})
export class GetActiveElementsForUrlPipe implements PipeTransform {

  transform(model: Url[]): Url[] {
    return model.filter(m => m.active);
  }

}
