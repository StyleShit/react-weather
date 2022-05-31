import React, { useEffect, useRef } from 'react';
import './css/Toast.css';

export default function Toast( { type, text } ) {
	const toastElement = useRef();

	useEffect( () => {
		const timeout = setTimeout( () => {
			toastElement.current.remove();
		}, 5000 );

		return () => {
			clearTimeout( timeout );
		};
	}, [ type ] );

	return (
		<div ref={ toastElement } className={ `toast toast-${ type }` }>
			{ text }
		</div>
	);
}
