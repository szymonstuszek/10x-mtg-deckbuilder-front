import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { DomPortal } from '@angular/cdk/portal';
import { Card } from '../models/deck.models';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appCardImagePopover]',
  standalone: false
})
export class CardImagePopoverDirective implements OnDestroy {
  @Input() card!: Card;
  
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();
  
  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.hidePopover();
  }
  
  @HostListener('mouseenter')
  showPopover(): void {
    // Don't show if there's no card or no image URL
    if (!this.card || !this.card.imageUrl) {
      return;
    }
    
    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      // Create a position strategy
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -8,
          }
        ]);
      
      // Create the overlay
      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.close(),
        hasBackdrop: false
      });
    }
    
    // Create the popover content
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      // Create container element
      const popoverContainer = document.createElement('div');
      popoverContainer.style.padding = '8px';
      
      // Create image element
      const imageElement = document.createElement('img');
      imageElement.src = this.card.imageUrl || '';
      imageElement.style.borderRadius = '12px';
      imageElement.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      imageElement.style.maxWidth = '240px';
      imageElement.style.height = 'auto';
      
      // Add image to container
      popoverContainer.appendChild(imageElement);
      
      // Create portal and attach to overlay
      const portal = new DomPortal(popoverContainer);
      this.overlayRef.attach(portal);
    }
  }
  
  @HostListener('mouseleave')
  hidePopover(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
} 