import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeckMetadata, DeckValidity } from '../../models/deck.models';

@Component({
  selector: 'app-deck-header',
  templateUrl: './deck-header.component.html',
  styleUrls: ['./deck-header.component.scss'],
  standalone: false
})
export class DeckHeaderComponent implements OnInit, OnChanges {
  @Input() metadata?: DeckMetadata;
  @Input() validity?: DeckValidity;
  @Input() isSaving: boolean = false;

  @Output() deckNameChanged = new EventEmitter<string>();
  @Output() saveClicked = new EventEmitter<void>();
  @Output() newClicked = new EventEmitter<void>();

  deckNameControl = new FormControl('');
  
  // Format options - for now, only Standard is supported
  formatOptions = [
    { value: 'Standard', label: 'Standard' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize form control
    this.deckNameControl.valueChanges.subscribe(name => {
      if (name !== this.metadata?.name && name) {
        this.deckNameChanged.emit(name);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Update form control when inputs change
    if (changes['metadata'] && this.metadata) {
      this.deckNameControl.setValue(this.metadata.name, { emitEvent: false });
    }
  }

  onSave(): void {
    this.saveClicked.emit();
  }

  onNew(): void {
    this.newClicked.emit();
  }

  // Helper method to get status icon for validity
  getValidityIcon(): string {
    return this.validity?.isValid ? 'check_circle' : 'error';
  }

  // Helper method to get status color for validity
  getValidityColor(): string {
    return this.validity?.isValid ? 'green' : 'red';
  }

  // Helper to get tooltip text
  getValidityTooltip(): string {
    if (!this.validity) {
      return 'Validating...';
    }
    
    return this.validity.isValid 
      ? 'Deck is valid' 
      : `Deck validation issues: ${this.validity.messages.join(', ')}`;
  }
} 