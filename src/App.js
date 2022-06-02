import React, { useEffect, useState } from 'react';
import { useWeather } from './hooks/useWeather';
import { useToasts } from './hooks/useToasts';
import WeatherBlock from './components/WeatherBlock';
import AutoComplete from './components/AutoComplete';
import Toast from './components/Toast';
import './App.css';

function App() {
	const { toasts, showToast } = useToasts();
	const { weather, addLocation, removeLocation, locationExists } = useWeather();
	const [ cities, setCities ] = useState( [] );

	useEffect( () => {
		addLocation( 'Jerusalem' );
		addLocation( 'washington' );
		addLocation( 'Japan' );

		( async () => {
			setCities( ( await import( './data/cities.json' ) ).default );
		} )();
	}, [] );

	const onSelect = async ( locationName ) => {
		const response = await addLocation( locationName );

		switch ( response.code ) {
			case 200:
				if ( locationExists( response.locationId ) ) {
					showToast( 'error', `Location "${ response.locationName }" already exists` );
				} else {
					showToast( 'success', `Location "${ response.locationName }" added` );
				}

				break;

			case 404:
				showToast( 'error', `Location "${ locationName }" not found` );
				break;

			default:
				break;
		}
	};

	return (
		<>
			<div className="toasts-container">
				{
					toasts.map( ( toast, i ) => (
						<Toast key={ i } type={ toast.type } text={ toast.text } />
					) )
				}
			</div>

			<div className="container">

				<h1 className="title">
					Weather Around the World
				</h1>

				<AutoComplete items={ cities } onSelect={ onSelect } />
				{
					Object.values( weather ).map( ( locationData ) => (
						<WeatherBlock
							key={ locationData.id }
							data={ locationData }
							onClose={ () => removeLocation( locationData.id ) }
						/>
					) )
				}

			</div>
		</>
	);
}

export default App;
