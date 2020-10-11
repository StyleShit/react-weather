import React, { useState, useRef, useEffect } from 'react';
import './css/Search.css';

export default function Search({ search, autocomplete })
{
    const searchInput = useRef();

    const [ term, setTerm ] = useState( '' );
    const [ autocompleteItems, setAutocompleteItems ] = useState( [] );
    const [ currentItem, setCurrentItem ] = useState( -1 );

    
    // catch arrow keys on search input for autocomplete navigation
    function onKeyUp( e )
    {
        switch( e.keyCode || e.which )
        {
            // up arrow -> previous item
            case 38:
                if( currentItem > 0 )
                    setCurrentItem( prev => prev - 1 );

                else
                    setCurrentItem( autocompleteItems.length - 1 );

                break;


            // down arrow -> next item
            case 40:
                if( currentItem < autocompleteItems.length -1 )
                    setCurrentItem( prev => prev + 1 );
                else
                    setCurrentItem( -1 );
                break;


            // enter -> set term to selected item
            case 13:
                if( currentItem !== -1 )
                    search( autocompleteItems[currentItem] );

                else
                    search( term );
                
                setTerm( '' );

                setAutocompleteItems([]);
                setCurrentItem( -1 );

                break;

            default:
                break;
        }
    }


    // catch TAB on search input for autocompletion
    function onKeyDown( e )
    {
        // tab
        if( e.keyCode === 9 )
        {
            e.preventDefault();
            setTerm( autocompleteItems[currentItem] );
        }
    }


    // show autocmplete suggestions for the current `term`
    function showAutoComplete()
    {
        var searchTerm = term.toLowerCase().trim();

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


    // shoe autocomplete when search term has changed
    useEffect( () => {

        const timeout = setTimeout( showAutoComplete, 300 );

        return() => {
            clearTimeout( timeout );
        }
        // eslint-disable-next-line
    }, [ term ]);


    return (
        <div className="search-container">
            <form onSubmit={ e => e.preventDefault() }>
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
