import {
  trigger,
  transition,
  style,
  query,
  animate,
  group
} from '@angular/animations';

export const fader =
  trigger('routeAnimations', [
    transition('* <=> *', [ // Apply to all route changes
      query(':enter, :leave', [
        style({
          position: 'absolute',
          left: '16px', // Adjusted for app-content padding
          width: 'calc(100% - 32px)', // Adjusted for app-content padding (16px left + 16px right)
          opacity: 0,
          transform: 'scale(0.95)', // Simplified transform
        }),
      ], { optional: true }),
      query(':enter', [
        animate('600ms ease',
          style({ opacity: 1, transform: 'scale(1)' }) // Simplified transform
        ),
      ], { optional: true })
    ])
  ]);

export const slider =
  trigger('routeAnimations', [
    transition('* => isLeft', slideTo('left') ),
    transition('* => isRight', slideTo('right') ),
    transition('isRight => *', slideTo('left') ),
    transition('isLeft => *', slideTo('right') )
]);

function slideTo(direction: string) {
  const optional = { optional: true };
  const headerHeight = '52px'; // Estimated header height

  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: headerHeight, // Adjusted for header height
        [direction]: 0,
        width: '100%'
      })
    ], optional),
    query(':enter', [
      style({ [direction]: '-100%'})
    ]),
    group([
      query(':leave', [
        animate('600ms ease-in-out', style({ [direction]: '100%'}))
      ], optional),
      query(':enter', [
        animate('600ms ease-in-out', style({ [direction]: '0%'}))
      ])
    ]),
  ];
} 