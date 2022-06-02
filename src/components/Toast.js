import React from 'react';
import './css/Toast.css';

export default function Toast( { type, text } ) {
	return (
		<div
			onAnimationEnd={ ( e ) => e.currentTarget.remove() }
			className={ `toast toast-${ type }` }
		>
			{ text }
		</div>
	);
}
