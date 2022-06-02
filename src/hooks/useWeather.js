import { useState, useCallback, useEffect } from 'react';

export const useWeather = () => {
	const [ weather, setWeather ] = useState( {} );

	const addLocation = useCallback( async ( locationName ) => {
		const data = await fetchLocation( locationName );

		if ( data.cod === 200 && ! ( data.id in weather ) ) {
			setWeather( ( prev ) => ( {
				...prev,
				[ data.id ]: data,
			} ) );
		}

		return {
			code: parseInt( data.cod ),
			locationId: data.id,
			locationName: data.name,
		};
	}, [ weather ] );

	const removeLocation = useCallback( ( locationId ) => {
		setWeather( ( prev ) => {
			const clone = { ...prev };

			delete clone[ locationId ];

			return clone;
		} );
	}, [] );

	const locationExists = useCallback( ( locationId ) => {
		return locationId in weather;
	}, [ weather ] );

	const refetch = useCallback( async () => {
		const newData = await Promise.all(
			Object.entries( weather )
				.map( async ( [ locationId, locationData ] ) => {
					return [
						locationId,
						await fetchLocation( locationData.name ),
					];
				} ),
		);

		setWeather( Object.fromEntries( newData ) );
	}, [] );

	useEffect( () => {
		const interval = setInterval( refetch, 10 * 60000 ); // 10 minutes.

		return () => {
			clearInterval( interval );
		};
	}, [ weather ] );

	return {
		weather,
		addLocation,
		removeLocation,
		locationExists,
		refetch,
	};
};

function fetchLocation( locationName ) {
	const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
	const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${ locationName }&appid=${ apiKey }&units=metric`;

	return fetch( endpoint ).then( ( res ) => res.json() );
}
