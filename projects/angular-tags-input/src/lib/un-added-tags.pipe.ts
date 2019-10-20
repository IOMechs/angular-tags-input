import { Pipe, PipeTransform } from '@angular/core';

import { AngularTagsInputConfig } from './tags-input-interfaces';

@Pipe({
  name: 'unAddedTags'
})
export class UnAddedTagsPipe implements PipeTransform {
  transform(tagsList: Array<any>, args: {tagsAdded: Array<any>, config: AngularTagsInputConfig}): any {
    const result = [];
    const {tagsAdded, config} = args;

    // if the tagsList is falsy, return empty list
    if (!tagsList) {
      return [];
    }

    // if we have to show selected tags (adds selected: true to every item (or nested tag))
    if (config.showTagsSelectedInDD) {
      tagsList = this.setSelectedTags(tagsList, config, tagsAdded);
    }

    // if we don't have to hide tags, send the tagsList (final, processed) back
    if (!config.hideAddedTags) {
      return tagsList;
    }

    /**
     * if we have to filter out the already selected tags in the dropdown, we'll filter these out
     * and thus the already selected tags won't go back in the results for dropdown
     */
    for (let i = 0, len = tagsList.length; i < len; ++i) {
      const currentTagItem = {...tagsList[i]};  // making sure we're not modifying the original object here
      if (!this.isTagAlreadySelected(currentTagItem, tagsAdded, config)) { // if the tag to add isn't added already
        currentTagItem.selected = false;
        if (config.nestedTagProperty && currentTagItem[config.nestedTagProperty]) {
          currentTagItem[config.nestedTagProperty] = currentTagItem[config.nestedTagProperty].filter((tagItem) => {
            return !this.isTagAlreadySelected(tagItem, tagsAdded, config);
          });
        }
        result.push(currentTagItem);
      }
    }
    return result;
  }

  /**
   * @author Ahsan Ayaz
   * @desc Compares a tag against all the tags added based on config provided
   * @param currentTag - the tag to check if it exists in the selection
   * @param tagsAdded - an array of the tags added to the selection
   * @param config - the config provided to the Angular Tags Input component
   * @return boolean - if the tag is added already
   */
  isTagAlreadySelected(currentTag, tagsAdded, config: AngularTagsInputConfig) {
    return tagsAdded.find(tagItem => {
      let matchFound = false;
      matchFound = this.areTagsMatching(currentTag, tagItem, config);
      if (matchFound) {
        return true;
      } else if (tagItem[config.nestedTagProperty]) {
        return this.isTagAlreadySelected(currentTag, tagItem[config.nestedTagProperty], config);
      }
      return false;
    });
  }

  /**
   * @author Ahsan Ayaz
   * @desc Compares the two tags based on the identifier provided in the config
   * @param currentTag - the tag in the iteration to compare
   * @param tagItem - the tag (already selected) to compare with
   * @param config - the config provided to the Angular Tags Input component
   * @return boolean - if the tags passed are the same.
   */
  areTagsMatching(currentTag, tagItem, config) {
    if (typeof tagItem[config.identifier] === 'number') {
      // handling if the type of identifier is a number
      return tagItem[config.identifier] === +currentTag[config.identifier];
    } else if (typeof tagItem[config.identifier] === 'string') {
      // handling if the type of identifier is a string
      return tagItem[config.identifier].toLowerCase() === currentTag[config.identifier].toLowerCase();
    }
  }

  setSelectedTags(tags, config: AngularTagsInputConfig, tagsAdded, isSelected = null) {
    return tags.map(currentTag => {
      currentTag.selected = !!this.isTagAlreadySelected(currentTag, tagsAdded, config);
      if (config.showTagsSelectedInDD && !!isSelected) {
        currentTag.selected = true;
      }
      if (currentTag[config.nestedTagProperty] && currentTag[config.nestedTagProperty].length) {
        currentTag[config.nestedTagProperty] = this.setSelectedTags(
          currentTag[config.nestedTagProperty],
          config,
          tagsAdded,
          currentTag.selected
        );
      }
      return currentTag;
    });
  }

}
