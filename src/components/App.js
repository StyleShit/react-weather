import React, { useEffect, useState } from 'react';
import './css/App.css';
import WeatherBlock from './WeatherBlock';
import Search from './Search';
import Toast from './Toast';

function App()
{
	const [ toasts, setToasts ] = useState([]);
	const [ locationsWeather, setLocationsWeather ] = useState([]);
	const [ cities, setCities ] = useState([]);

	const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

	
	// search & add location by name
	function addLocation( location )
	{
		var endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${ location }&appid=${ apiKey }&units=metric`;

		fetch( endpoint ).then( res => res.json() ).then( json => {
			
			switch( parseInt( json.cod ) )
			{
				case 200:
					if( locationExists( json ) )
						toast( 'error', 'Location "' + json.name + '" already exists' );

					else
					{
						setLocationsWeather( prev => [...prev, json ]);
						toast( 'success', 'Location "' + json.name + '" added' );
					}

					break;

				case 404:
					toast( 'error', 'Location "' + location + '" not found' );
					break;

				default:
					break;
			}

		}).catch( e => {
			console.log( e );
		});
	}


	// show toast
	function toast( type, msg )
	{
		setToasts( prev => (
			[ ...prev, { type, msg } ]
		));
	}


	// update all existing weather data
	async function updateData()
	{
		var newWeatherData = await Promise.all( locationsWeather.map( async ( l ) =>
		{

			var endpoint = `https://api.openweathermap.org/data/2.5/weather?id=${ l.id }&appid=${ apiKey }&units=metric`;
			var newData = await fetch( endpoint ).then( res => res.json() );
			newData.name = l.name;
			newData.sys.country = l.sys.country;

			return newData;

		}));

		setLocationsWeather( newWeatherData );
		toast( 'info', 'Data updated!' );
	}


	// check if a location is already exists in the list
	function locationExists( location )
	{
		var found = false;

		locationsWeather.forEach( l => {
			if( l.id === location.id )
			{
				found = true;
				return;
			}
		});

		return found;
	}

	
	// sort the current selected locations 
	function sortLocations()
	{
		// sort array
		var tmp = [ ...locationsWeather ];
		
		tmp.sort( ( a, b ) => {
			var x = a.name.toLowerCase();
			var y = b.name.toLowerCase();

			if( x <  y) { return -1; }
			if( x > y ) { return 1; }
			return 0;
		});

		return tmp;
	}


	function removeLocation( id )
	{
		setLocationsWeather( prev => {
			var tmp = prev.filter( l => {
				return l.id !== id
			});

			return tmp;
		});
	}

	// init weather data updater interval
	useEffect(() => {


		// init interval
		const updateDataInterval = setInterval( () => {
			updateData();
		}, 3  * 60000 );

		return() => {
			clearInterval( updateDataInterval );
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ locationsWeather ]);


	// load cities & add default locations on mount
	useEffect( () => {

		// get cities array
		fetch( 'cities.json' ).then( res => res.json() ).then( json => {
			
			setTimeout( () => {

				json.sort( ( a, b ) => {
					var x = a.toLowerCase();
					var y = b.toLowerCase();
		
					if( x <  y) { return -1; }
					if( x > y ) { return 1; }
	
					return 0;
				});
	
				setCities( json );

			}, 500);
		});

		addLocation( 'Jerusalem' );
		addLocation( 'washington' );
		addLocation( 'Japan' );

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);


	return (
		<>
			<div className="toasts-container">
				{
					toasts.map(( t, i ) => (
						<Toast key={ i } msg={ t.msg } type={ t.type } />
					))
				}
			</div>

			<div className="container">
				
				<h1 className="title">
					Weather Around the World
				</h1>

				<Search search={ addLocation } autocomplete={ cities } />
				{ 
					sortLocations( locationsWeather ).map(( data, i ) => (
						<WeatherBlock remove={ removeLocation } key={ i } data={ data } />
					))
				}

			</div>
		</>
	);
}

export default App;