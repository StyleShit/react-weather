import React, { useEffect, useRef } from 'react';
import './css/Toast.css';

export default function Toast({ type, msg }) 
{
    const toastElement = useRef();

    useEffect(() => {

        var timeout = setTimeout( () => {

            toastElement.current.remove()

        }, 5000 );


        return () => {
            
            clearTimeout( timeout );

        }
    }, [ type ]);
    
    return (
        <div ref={ toastElement } className={ `toast toast-${ type }` }>
            { msg }
        </div>
    )
}
