import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CardFilters } from '../../models/deck.models';

@Component({
  selector: 'app-card-search-filter',
  templateUrl: './card-search-filter.component.html',
  styleUrls: ['./card-search-filter.component.scss'],
  standalone: false
})
export class CardSearchFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentFilters?: CardFilters;
  @Output() filtersChanged = new EventEmitter<CardFilters>();

  filterForm: FormGroup;
  
  // Options for dropdowns
  rarityOptions = [
    { value: 'Common', label: 'Common' },
    { value: 'Uncommon', label: 'Uncommon' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Mythic', label: 'Mythic Rare' }
  ];
  
  colorOptions = [
    { value: 'W', label: 'White' },
    { value: 'U', label: 'Blue' },
    { value: 'B', label: 'Black' },
    { value: 'R', label: 'Red' },
    { value: 'G', label: 'Green' },
    { value: 'C', label: 'Colorless' }
  ];
  
  typeOptions = [
    { value: 'Creature', label: 'Creature' },
    { value: 'Instant', label: 'Instant' },
    { value: 'Sorcery', label: 'Sorcery' },
    { value: 'Artifact', label: 'Artifact' },
    { value: 'Enchantment', label: 'Enchantment' },
    { value: 'Planeswalker', label: 'Planeswalker' },
    { value: 'Land', label: 'Land' }
  ];
  
  setOptions = [
    { value: 'M20', label: 'Core Set 2020' },
    { value: 'ELD', label: 'Throne of Eldraine' },
    { value: 'THB', label: 'Theros Beyond Death' },
    { value: 'IKO', label: 'Ikoria: Lair of Behemoths' },
    { value: 'M21', label: 'Core Set 2021' },
    { value: 'ZNR', label: 'Zendikar Rising' }
  ];
  
  // For cleanup
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    // Initialize form
    this.filterForm = this.fb.group({
      name: [null],
      set: [null],
      rarity: [null],
      color: [null],
      type: [null],
      manaCost: [null]
    });
  }

  ngOnInit(): void {
    // Subscribe to form changes
    this.filterForm.valueChanges.pipe(
      debounceTime(300), // Wait for user to stop typing
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntil(this.destroy$)
    ).subscribe(formValue => {
      this.emitFilterChanges(formValue);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When currentFilters input changes, update form
    if (changes['currentFilters'] && this.currentFilters) {
      this.filterForm.patchValue({
        name: this.currentFilters.name,
        set: this.currentFilters.set,
        rarity: this.currentFilters.rarity,
        color: this.currentFilters.color,
        type: this.currentFilters.type,
        manaCost: this.currentFilters.manaCost
      }, { emitEvent: false });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Reset all filters
  resetFilters(): void {
    this.filterForm.reset();
    // Form valueChanges will trigger the filter update
  }

  // Send updated filters to parent component
  private emitFilterChanges(formValue: any): void {
    const filters: CardFilters = {
      name: formValue.name,
      set: formValue.set,
      rarity: formValue.rarity,
      color: formValue.color,
      type: formValue.type,
      manaCost: formValue.manaCost
    };
    
    this.filtersChanged.emit(filters);
  }
} 