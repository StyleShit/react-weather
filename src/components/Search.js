import React, { useState, useRef } from 'react';
import './css/Search.css';

export default function Search({ search, autocomplete })
{
    const searchInput = useRef();

    const [ term, setTerm ] = useState( '' );
    const [ autocompleteItems, setAutocompleteItems ] = useState( [] );
    const [ currentItem, setCurrentItem ] = useState( -1 );

    function submitForm( e )
    {
        e.preventDefault();
    }


    function onKeyUp( e )
    {
        switch( e.keyCode || e.which )
        {
            // up arrow
            case 38:
                if( currentItem > 0 )
                    setCurrentItem( prev => prev - 1 );

                else
                    setCurrentItem( autocompleteItems.length - 1 );

                break;

            // down arrow
            case 40:
                if( currentItem < autocompleteItems.length -1 )
                    setCurrentItem( prev => prev + 1 );
                else
                    setCurrentItem( 0 );
                break;

            // enter
            case 13:
                if( currentItem !== -1 )
                    setTerm( autocompleteItems[currentItem] );

                else
                {
                    search( term );
                    setTerm( '' );
                }

                setAutocompleteItems([]);
                setCurrentItem( -1 );

                break;

            // search
            default:
                showAutocomplete( e );
                break;
        }
    }


    function onKeyDown( e )
    {
        // tab
        if( e.keyCode === 9 )
        {
            e.preventDefault();
            setTerm( autocompleteItems[currentItem] );
        }
    }


    function showAutocomplete( e )
    {
        var searchTerm = e.target.value.trim().toLowerCase();

        if( searchTerm === '' )
        {
            setAutocompleteItems( [] );
            setCurrentItem( -1 );
            return;
        }


        var results = [];
        var count = 15;

        for( var i = 0; i < autocomplete.length; i++ )
        {
            if( autocomplete[i].toLowerCase().indexOf( searchTerm ) > -1 )
                results = [ ...results, autocomplete[i] ];

            if( results.length === count )
                break;
        }

        setAutocompleteItems( results );
    }


    return (
        <div className="search-container">
            <form onSubmit={ submitForm }>
                <input ref={ searchInput } type="text" placeholder="Type a location and press Enter" value={ term } 
                    onChange={ ( e ) => { setTerm( e.target.value ) } } 
                    onKeyUp={ onKeyUp }
                    onKeyDown={ onKeyDown } />

                <div className="autocomplete-container">
                    {
                        autocompleteItems.map( ( item, i ) => {
                            return (
                                <span className={ `autocomplete-item ${ i === currentItem ? 'current-item' : '' }` } 
                                    onClick={ () => {
                                        search( item );
                                        setTerm( '' );
                                        setCurrentItem( -1 );
                                        setAutocompleteItems( [] );
                                    }}
                                    key={ i }>
                                    { item.replace( ',', ', ' ) }
                                </span>
                            )
                        })
                    }
                </div>
            </form>
        </div>
    )
}
