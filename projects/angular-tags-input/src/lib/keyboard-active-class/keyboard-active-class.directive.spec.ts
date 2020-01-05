import { KeyboardActiveClassDirective } from './keyboard-active-class.directive';
import { ChangeDetectorRef, ElementRef } from '@angular/core';

describe('KeyboardActiveClassDirective', () => {
  const cdRef: ChangeDetectorRef = null;
  it('should create an instance', () => {
    const directive = new KeyboardActiveClassDirective(
      new ElementRef(document.createElement('DIV')),
      cdRef
    );
    expect(directive).toBeTruthy();
  });
});
