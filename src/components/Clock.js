import React from 'react';
import { useClock } from '../hooks/useClock';
import './css/Clock.css';

export default function Clock( { offset } ) {
	const currentTime = useClock( offset );

	const hours = currentTime.getHours().toString().padStart( 2, '0' );
	const minutes = currentTime.getMinutes().toString().padStart( 2, '0' );
	const seconds = currentTime.getSeconds().toString().padStart( 2, '0' );

	return (
		<div className="clock-container">
			{ hours }:{ minutes }:{seconds}
		</div>
	);
}
