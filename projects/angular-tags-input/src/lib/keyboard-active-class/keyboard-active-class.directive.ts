import { Directive, Input, OnChanges, SimpleChanges, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';

@Directive({
  selector: '[tiKeyboardActiveClass]'
})
export class KeyboardActiveClassDirective implements OnInit, OnChanges {
  @Input() isKeyboardActiveItem = false;
  @Input() tiKeyboardActiveClass: string;
  constructor(private el: ElementRef, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    if (!this.tiKeyboardActiveClass) {
      console.warn('tiKeyboardActiveClass needs a class to apply. But no class was passed.');
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (!simpleChanges.isKeyboardActiveItem) {
      return;
    }
    if (simpleChanges.isKeyboardActiveItem.currentValue !== simpleChanges.isKeyboardActiveItem.previousValue) {
      this.evaluateClassApplication();
    }
  }

  evaluateClassApplication() {
    if (this.isKeyboardActiveItem) {
      this.el.nativeElement.classList.add(this.tiKeyboardActiveClass);
      this.el.nativeElement.scrollIntoView(false);
    } else {
      this.el.nativeElement.classList.remove(this.tiKeyboardActiveClass);
    }
    this.cdRef.markForCheck();
  }

}
