import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { AngularTagItem, AngularTagsInputConfig } from '../tags-input-interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ti-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit, OnChanges {
  @Input() inputClass = 'default';
  @Input() config: AngularTagsInputConfig;
  @Input() disabled = false;
  @Output() valueChanged = new EventEmitter<string>();
  @Output() inputFocused = new EventEmitter<string>();
  @Output() inputBlurred = new EventEmitter<string>();
  @Output() tagEntered = new EventEmitter<AngularTagItem>();
  @ViewChild('inputEl', { static: true }) inputEl: ElementRef;
  tagInputForm = new FormGroup({
    tagInputVal: new FormControl('')
  });
  lastValueEmitted: string;
  constructor() { }

  ngOnInit() {
    this.tagInputForm.get('tagInputVal')
      .valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        this.lastValueEmitted = value;
        this.valueChanged.emit(value);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled !== undefined) {
      if (changes.disabled.currentValue === true) {
        this.tagInputForm.get('tagInputVal').disable();
      } else {
        this.tagInputForm.get('tagInputVal').enable();
      }
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc Emits the input focused event with the current search term value
   */
  emitInputFocused() {
    if (this.disabled) {
      return;
    }
    const searchTerm = this.tagInputForm.get('tagInputVal').value;
    this.inputFocused.emit(searchTerm);

    if (this.lastValueEmitted !== searchTerm) {
      this.valueChanged.emit(searchTerm);
      this.lastValueEmitted = searchTerm;
    }
  }

  /**
   * @author Ahsan Ayaz
   * @desc When the user presses enter key after entering the tag name
   * @param inputEl - Reference to the input element so we can fetch the value
   */
  onEnterKeyPress() {
    if (this.config.onlyFromAutoComplete) {
      return;
    }
    const tagName = this.inputEl.nativeElement.value;
    this.tagEntered.emit({
      [this.config.displayProperty]: tagName,
      [this.config.identifier]: tagName.toLowerCase(),
      newTag: true
    });
    this.resetInput();
  }

    /**
   *  @author Annas baig
   * @desc focus the input field
   *
   */
    focus() {
      if (this.inputEl) {
        this.inputEl.nativeElement.focus();
      }
    }

  /**
   * @author Ahsan Ayaz
   * @desc Resets the input value
   */
  resetInput() {
    this.inputEl.nativeElement.value = '';
  }

  emitInputBlurred($event) {
    this.inputBlurred.emit($event);
  }
}
