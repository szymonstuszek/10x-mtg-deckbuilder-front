import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Card } from '../models/deck.models';
import { Subject } from 'rxjs';
import { ComponentRef, Injector, EmbeddedViewRef, createComponent, ApplicationRef } from '@angular/core';

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
    private renderer: Renderer2,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.hidePopover();
  }
  
  @HostListener('mouseenter')
  showPopover(): void {
    console.log('Mouse enter detected', this.card);
    
    // Don't show if there's no card or no image URL
    if (!this.card || !this.card.imageUrl) {
      console.log('No card or image URL:', this.card?.imageUrl);
      return;
    }
    
    // Create overlay if it doesn't exist
    if (!this.overlayRef) {
      // Create a position strategy
      const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([
          {
            originX: 'end',
            originY: 'center',
            overlayX: 'start',
            overlayY: 'center',
            offsetX: 10
          },
          {
            originX: 'start',
            originY: 'center',
            overlayX: 'end',
            overlayY: 'center',
            offsetX: -10
          },
          {
            originX: 'center',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetY: 10
          },
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom',
            offsetY: -10
          }
        ]);
      
      // Create the overlay
      this.overlayRef = this.overlay.create({
        positionStrategy,
        scrollStrategy: this.overlay.scrollStrategies.reposition(),
        hasBackdrop: false
      });
    }
    
    // Create the popover content
    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      console.log('Creating popover with image URL:', this.card.imageUrl);
      
      // Create and attach a div to the overlay directly
      const overlayElement = this.overlayRef.overlayElement;
      
      // Create a container div
      const container = document.createElement('div');
      container.style.padding = '8px';
      container.style.background = 'white';
      container.style.borderRadius = '12px';
      container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
      container.style.zIndex = '1000';
      
      // Create the image element
      const imageElement = document.createElement('img');
      imageElement.src = this.card.imageUrl || '';
      imageElement.style.borderRadius = '8px';
      imageElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      imageElement.style.maxWidth = '240px';
      imageElement.style.height = 'auto';
      
      // Add fallback for image error
      imageElement.onerror = () => {
        console.error('Image failed to load', this.card.imageUrl);
        imageElement.style.display = 'none';
        
        const fallbackText = document.createElement('div');
        fallbackText.textContent = `${this.card.name} (Image not available)`;
        fallbackText.style.padding = '10px';
        fallbackText.style.fontWeight = 'bold';
        container.appendChild(fallbackText);
      };
      
      // Add image to container and container to overlay
      container.appendChild(imageElement);
      overlayElement.appendChild(container);
      
      // Mark the overlay as attached
      this.overlayRef.hostElement.classList.add('cdk-overlay-connected-position-bounding-box');
      this.overlayRef.hostElement.style.display = 'flex';
      
      console.log('Image container attached to overlay');
      imageElement.onload = () => console.log('Image loaded successfully');
    }
  }
  
  @HostListener('mouseleave')
  hidePopover(): void {    if (this.overlayRef) {
      // Clear the overlay content
      while (this.overlayRef.overlayElement.firstChild) {
        this.overlayRef.overlayElement.removeChild(this.overlayRef.overlayElement.firstChild);
      }
      
      // Optionally dispose of the overlay entirely if needed
      // this.overlayRef.dispose();
      // this.overlayRef = null;
    }
  }
} 