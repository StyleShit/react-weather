import React, { useRef, useState } from 'react';
import './css/AutoComplete.css';

export default function AutoComplete( props ) {
	const [ term, setTerm ] = useState( '' );
	const [ autocompleteItems, setAutocompleteItems ] = useState( [] );
	const [ currentItemId, setCurrentItemId ] = useState( -1 );
	const onChangeTimeout = useRef( null );

	const onChange = ( e ) => {
		const { value } = e.target;

		setTerm( value );

		clearTimeout( onChangeTimeout.current );

		onChangeTimeout.current = setTimeout( () => {
			setCurrentItemId( -1 );
			setAutocompleteItems( filterItems( props.items, value ) );
		}, 250 );
	};

	const onKeyUp = ( e ) => {
		const isFirst = ( currentItemId === 0 );
		const isLast = ( currentItemId === autocompleteItems.length - 1 );

		switch ( e.keyCode ?? e.which ) {
			// Arrow up -> Previous item
			case 38:
				if ( isFirst ) {
					setCurrentItemId( autocompleteItems.length - 1 );
				} else {
					setCurrentItemId( ( prev ) => prev - 1 );
				}
				break;

			// Arrow down -> Next item
			case 40:
				if ( isLast ) {
					setCurrentItemId( 0 );
				} else {
					setCurrentItemId( ( prev ) => prev + 1 );
				}

				break;

			// Enter -> Set term to selected item
			case 13:
				if ( currentItemId !== -1 ) {
					onSelect( autocompleteItems[ currentItemId ] );
				} else {
					onSelect( term );
				}

				break;

			default:
				break;
		}
	};

	function onKeyDown( e ) {
		// Tab
		if ( e.keyCode === 9 ) {
			e.preventDefault();
			setTerm( autocompleteItems[ currentItemId ] );
		}
	}

	const onSelect = ( item ) => {
		setTerm( '' );
		setAutocompleteItems( [] );
		setCurrentItemId( -1 );

		if ( props.onSelect ) {
			props.onSelect( item );
		}
	};

	return (
		<div className="autocomplete-container">
			<form onSubmit={ ( e ) => e.preventDefault() }>
				<input
					type="text"
					placeholder="Type a location and press Enter"
					value={ term }
					onChange={ onChange }
					onKeyUp={ onKeyUp }
					onKeyDown={ onKeyDown }
				/>

				<div className="autocomplete-items-container">
					{
						autocompleteItems.map( ( item, i ) => (
							<span
								key={ i }
								className={ `autocomplete-item ${ i === currentItemId ? 'current-item' : '' }` }
								onClick={ () => onSelect( item ) }
							>
								{ item.replace( ',', ', ' ) }
							</span>
						) )
					}
				</div>
			</form>
		</div>
	);
}

function filterItems( items, searchTerm, count = 5 ) {
	searchTerm = searchTerm.toLowerCase().trim();

	if ( ! searchTerm ) {
		return [];
	}

	const results = [];

	for ( let i = 0; i < items.length; i++ ) {
		if ( items[ i ].toLowerCase().includes( searchTerm ) ) {
			results.push( items[ i ] );
		}

		if ( results.length === count ) {
			break;
		}
	}

	return results;
}
