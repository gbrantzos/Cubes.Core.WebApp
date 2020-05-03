import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'listItemExpression'
})
export class ListItemExpressionPipe implements PipeTransform {

  transform(listItem: any, expression: string): string {
    const func   = new Function('listItem', expression);
    const result = func(listItem);

    return result;
  }
}
