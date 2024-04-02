import { Injectable } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
	trigger,
	transition,
	style,
	query,
	group,
	animateChild,
	animate,
	keyframes,
	state,
} from '@angular/animations';
const optional = { optional: true };
export const flyInOut = trigger('flyInOut', [
	state('in', style({ transform: 'translateX(0)' })),
	transition('void => *', [
		style({ transform: 'translateX(-100%)' }),
		animate(100)
	]),
	transition('* => void', [
		animate(100, style({ transform: 'translateX(100%)' }))
	])
]);
export const splitFull = trigger('splitFull', [
	state('split', style({
		flex: '0 0 50%',
		width: '50%',
		position: 'relative'
	})),
	transition('full => split', animate('200ms ease')),
	state('full', style({
		flex: '0 0 100%',
		width: '100%',
		position: 'relative'
	})),
	transition('split => full', animate('300ms ease'), { delay: '4000ms' }),
]);
export const splitHide = trigger('splitHide', [
	state('split', style({
		width: '50%',
		float: 'left',
		position: 'relative'
	})),
	transition('full => split', animate('200ms ease')),
	state('full', style({
		position: 'relative'
	})),
	transition('split => full', animate('300ms 300ms ease', style({ width: '0%'}))),
]);
export const slider = trigger('routeAnimations', [
	transition('* => isLeft', slideTo('left')),
	transition('* => isRight', slideTo('right')),
	transition('isRight => *', slideTo('left')),
	transition('isLeft => *', slideTo('right'))
]);

function slideTo(direction) {
	return [
		query(':enter, :leave', [
			style({
				position: 'absolute',
				top: 0,
				[direction]: 0,
				width: '100%'
			})
		], optional),
		query(':enter', [
			style({ [direction]: '-100%' })
		], optional),
		group([
			query(':leave', [
				animate('500ms ease', style({ [direction]: '100%' }))
			], optional),
			query(':enter', [
				animate('600ms 400ms ease', style({ [direction]: '0%' }))
			], optional)
		]),
		// Normalize the page style... Might not be necessary

		// Required only if you have child animations on the page
		// query(':leave', animateChild()),
		// query(':enter', animateChild()),
	];
}

export const fader =
	trigger('routeAnimations', [
		transition('* <=> *', [
			// Set a default  style for enter and leave
			query(':enter, :leave', [
				style({
					position: 'absolute',
					left: 0,
					width: '100%',
					opacity: 0,
					transform: 'scale(0) translateY(100%)',
				}),
			]),
			// Animate the new page in
			query(':enter', [
				animate('600ms ease', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
			])
		]),
	]);


@Injectable({
	providedIn: 'root'
})
export class AnimationService {
	public get(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
	}
}
