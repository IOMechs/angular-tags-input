import { TestBed } from '@angular/core/testing';

import { AngularTagsInputService } from './angular-tags-input.service';

describe('AngularTagsInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularTagsInputService = TestBed.get(AngularTagsInputService);
    expect(service).toBeTruthy();
  });
});
