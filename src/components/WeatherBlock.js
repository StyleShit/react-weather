import React, { useState, useEffect } from 'react';
import Clock from './Clock';
import './css/WeatherBlock.css';

const iconsMap = {
	'01d': 'sun',
	'01n': 'bright-moon',

	'02d': 'partly-cloudy-day',
	'02n': 'night',

	'03d': 'cloud',
	'03n': 'cloud',

	'04d': 'skydrive',
	'04n': 'skydrive',

	'09d': 'torrential-rain',
	'09n': 'torrential-rain',

	'10d': 'partly-cloudy-rain',
	'10n': 'light-rain',

	'11d': 'cloud-lighting',
	'11n': 'cloud-lighting',

	'13d': 'snowflake',
	'13n': 'snowflake',

	'50d': 'wind',
	'50n': 'wind',
};

export default function WeatherBlock( { data, remove } ) {
	const [ cssClass, setCssClass ] = useState( '' );
	const [ locationName, setLocationName ] = useState( '' );
	const [ icon, setIcon ] = useState( '' );
	const [ temp, setTemp ] = useState( '' );

	useEffect( () => {
		setIcon( iconsMap[ data.weather[ 0 ].icon ] );
		setTemp( Math.floor( data.main.temp ) );

		// day / night
		setCssClass( data.weather[ 0 ].icon.includes( 'd' ) ? 'day' : 'night' );
		setCssClass( ( prev ) => data.weather[ 0 ].icon.includes( '13' ) ? 'snow' : prev );

		if ( data.sys.country )
			setLocationName( data.name + ', ' + data.sys.country );

		else
			setLocationName( data.name );
	}, [ data ] );

	return (

		<div className={ `weather-block ${ cssClass }` }>

			<span className="remove-weather-block" onClick={ () => {
				remove( data.id );
			} }></span>

			<div className="temperature">
				{ temp }
			</div>

			<div className="location-data">
				<span className="location-time has-icon">
					<Clock offset={ data.timezone } />
				</span>

				<br />

				<span className="location-name has-icon">
					{ locationName }
				</span>
			</div>

			<div className="location-data">
				<span className="humidity has-icon">
					{ data.main.humidity }%
				</span>

				<br />

				<span className="wind has-icon">
					{ data.wind.speed }<sup>m/s</sup>
				</span>
			</div>

			<div className="weather-icon">
				<img data-icon={ icon } alt={ icon } src={ `https://img.icons8.com/ios/50/ffffff/${ icon }.png` } />
				<span className="weather-description">
					{ data.weather[ 0 ].main }
				</span>
			</div>
		</div>
	);
}
