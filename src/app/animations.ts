import {
  trigger,
  transition,
  style,
  animate,
  keyframes,
  query,
  stagger,
} from '@angular/animations';

export const fadeInUp = trigger('fadeInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(50px) scale(0.95)' }),
    animate(
      '1200ms cubic-bezier(0.22, 1, 0.36, 1)',
      style({ opacity: 1, transform: 'translateY(0) scale(1)' })
    ),
  ]),
]);

export const rotateIn = trigger('rotateIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'rotate(-20deg) scale(0.8)' }),
    animate(
      '1000ms ease-in-out',
      style({ opacity: 1, transform: 'rotate(0deg) scale(1)' })
    ),
  ]),
]);

export const zoomIn = trigger('zoomIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.6)' }),
    animate(
      '800ms cubic-bezier(0.25, 1, 0.5, 1)',
      style({ opacity: 1, transform: 'scale(1)' })
    ),
  ]),
]);

export const textFlicker = trigger('textFlicker', [
  transition(':enter', [
    animate(
      '2s',
      keyframes([
        style({ opacity: 0, offset: 0 }),
        style({ opacity: 1, offset: 0.3 }),
        style({ opacity: 0.7, offset: 0.6 }),
        style({ opacity: 1, offset: 1 }),
      ])
    ),
  ]),
]);

// export const floatingAnimation = trigger('floatingAnimation', [
//   transition('* => *', [
//     animate(
//       '3s ease-in-out infinite',
//       keyframes([
//         style({ transform: 'translateY(0px)', offset: 0 }),
//         style({ transform: 'translateY(-10px)', offset: 0.5 }),
//         style({ transform: 'translateY(0px)', offset: 1 }),
//       ])
//     ),
//   ]),
// ]);

export const staggeredCards = trigger('staggeredCards', [
  transition(':enter', [
    query(
      '.work-card',
      [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        stagger(
          '150ms',
          animate(
            '1000ms ease-out',
            style({ opacity: 1, transform: 'translateX(0)' })
          )
        ),
      ],
      { optional: true }
    ),
  ]),
]);
