import { Injectable } from '@angular/core';
import { AngularTagsInputConfig } from './tags-input-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AngularTagsInputService {

  constructor() { }

  /**
   * @author Ahsan Ayaz
   * @desc Finds a tag by Id
   * @param tagsData Array of the tags (could be heirarchical)
   * @param tagId identifier of the tag to be found
   * @param config the tags input config
   * @returns the tag found, or `undefined`
   */
  findTagById(tagsData, tagId, config: AngularTagsInputConfig) {
    for (let i = 0, len = tagsData.length; i < len; ++i) {
      // tslint:disable-next-line:triple-equals
      if (tagsData[i][config.identifier] == tagId) {
        return tagsData[i];
      }
      if (tagsData[i][config.nestedTagProperty]) {
        const nestedParentFound = this.findTagById(tagsData[i][config.nestedTagProperty], tagId, config);
        if (nestedParentFound) {
          return nestedParentFound;
        }
      }
    }
  }

  findParent(tagsArray, tagItem, config: AngularTagsInputConfig) {
    for (let i = 0, len = tagsArray.length; i < len; ++i) {
      // tslint:disable-next-line:triple-equals
      if (tagsArray[i][config.identifier] == tagItem[config.identifier]) {
        return tagsArray[i];
      }
      if (tagsArray[i][config.nestedTagProperty]) {
        const nestedParentFound = this.findParent(tagsArray[i][config.nestedTagProperty], tagItem, config);
        if (nestedParentFound) {
          return nestedParentFound;
        }
      }
    }
  }

  getMainTagAfterAdding(tagsArray, tagAdded, tags, config: AngularTagsInputConfig) {
    if (tagAdded[config.nestedTagParentProp]) {
      const parentTag = this.findTagById(
        tagsArray,
        tagAdded[config.nestedTagParentProp],
        config
      );
      if (!parentTag) {
        return;
      }
      const parentTagChildren = parentTag[config.nestedTagProperty].length;
      const childrensSelected = parentTag[config.nestedTagProperty].filter((tagItem) => {
        // tslint:disable-next-line:triple-equals
        return !!tagItem['selected'];
      }).length;
      if (parentTagChildren > 0 && childrensSelected > 0 && childrensSelected === parentTagChildren) {
        parentTag['selected'] = true;
        if (!parentTag[config.nestedTagParentProp]) {
          return parentTag;
        } else {
          return this.getMainTagAfterAdding(tagsArray, parentTag, tags, config);
        }
      }
    }
    return tagAdded;
  }
}
