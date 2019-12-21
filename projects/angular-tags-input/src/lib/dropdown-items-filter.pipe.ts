import { Pipe, PipeTransform } from '@angular/core';
import { AngularTagItem, AngularTagsInputConfig } from './tags-input-interfaces';

@Pipe({
  name: 'dropdownItemsFilter'
})
export class DropdownItemsFilterPipe implements PipeTransform {

  transform(tagItems: Array<AngularTagItem> = [], config: AngularTagsInputConfig, searchTerm = ''): any {
    if (!searchTerm) {
      return tagItems;
    }
    return [...tagItems]
      .map((item: AngularTagItem) => this.getFilteredItem({...item}, config, searchTerm))
      .filter(item => !!item);
  }

  getFilteredItem(item: AngularTagItem, config: AngularTagsInputConfig, searchTerm: string = '') {
    if (searchTerm === '') {
      return item;
    }
    let matches = false;
    if (item[config.displayProperty].toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    }

    if (item[config.nestedTagProperty]) {
      const childItems = item[config.nestedTagProperty].map(nestedItem => {
        return this.getFilteredItem(nestedItem, config, searchTerm);
      }).filter(nestedItem => !!nestedItem);

      matches = childItems.length > 0;

      if (matches) {
        return {
          ...item,
          [config.nestedTagProperty]: [...childItems]
        };
      }
    }

    return null;
  }

}
