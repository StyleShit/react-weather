import { useEffect, useState } from 'react';

export function useClock( timeZoneOffset = 0 ) {
	const [ currentTime, setCurrentTime ] = useState( getUtcTime( timeZoneOffset ) );

	const updateTime = () => {
		setCurrentTime( getUtcTime( timeZoneOffset ) );
	};

	useEffect( () => {
		Clock.register( updateTime );

		return () => Clock.unregister( updateTime );
	}, [] );

	return currentTime;
}

// Used to sync between all timers.
const Clock = {
	callbacks: [],

	register( callback ) {
		this.callbacks.push( callback );
	},

	unregister( callback ) {
		this.callbacks = this.callbacks.filter( ( cb ) => cb !== callback );
	},

	start() {
		setInterval( () => {
			this.callbacks.forEach( ( callback ) => callback() );
		}, 1000 );
	},
};

Clock.start();

export function getUtcTime( timezoneOffset = 0 ) {
	const now = new Date();
	const utcTime = now.getTime() + ( now.getTimezoneOffset() * 60000 );

	return new Date( utcTime + ( timezoneOffset * 1000 ) );
}
