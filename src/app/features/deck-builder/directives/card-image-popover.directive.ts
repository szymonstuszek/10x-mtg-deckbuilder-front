import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Card } from '../models/deck.models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appCardImagePopover]'
})
export class CardImagePopoverDirective implements OnDestroy {
  @Input('appCardImagePopover') card!: Card;
  
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
      // Create image element
      const image = this.renderer.createElement('img');
      this.renderer.setAttribute(image, 'src', this.card.imageUrl || '');
      this.renderer.setStyle(image, 'border-radius', '12px');
      this.renderer.setStyle(image, 'box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)');
      this.renderer.setStyle(image, 'max-width', '240px');
      this.renderer.setStyle(image, 'height', 'auto');
      
      // Create container
      const container = this.renderer.createElement('div');
      this.renderer.setStyle(container, 'padding', '8px');
      this.renderer.appendChild(container, image);
      
      // Attach content to overlay
      this.overlayRef.attach(new ComponentPortal(null, null, {
        $implicit: container
      }));
    }
  }
  
  @HostListener('mouseleave')
  hidePopover(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
  }
} 