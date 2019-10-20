import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AngularTagItem, AngularTagsInputConfig } from '../tags-input-interfaces';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ti-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss']
})
export class TagInputComponent implements OnInit {
  @Input() inputClass = 'default';
  @Input() config: AngularTagsInputConfig;
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

  /**
   * @author Ahsan Ayaz
   * @desc Emits the input focused event with the current search term value
   */
  emitInputFocused() {
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
   * @author Ahsan Ayaz
   * @desc Resets the input value
   */
  resetInput() {
    this.inputEl.nativeElement.value = '';
  }

}
