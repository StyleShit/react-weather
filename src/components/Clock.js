import React, { useState, useEffect } from 'react'
import './css/Clock.css';

export default function Clock({ offset })
{
    // handle current time
    const [ currentTime, serCurrentTime ] = useState( getUtcDate( offset ) );


    // set & destroy clock interval
    useEffect( function(){

        serCurrentTime( new Date( getUtcDate( offset ) ) );
        
        const clockInterval = setInterval( () => {
            serCurrentTime( new Date( getUtcDate( offset ) ) );
        }, 1000 );

        return () => {
            clearInterval( clockInterval );
        };

    }, [ offset ]);
    

    // get current UTC time as date object
    function getUtcDate( offset )
    {
        var now = new Date();
        var utcTime = now.getTime() + ( now.getTimezoneOffset() * 60000 ); 

        return new Date( utcTime + ( offset * 1000 ) );
    }


    // add zero at the beginning of number if it's lower than 10
    function addZero( num )
    {
        if( num < 10 )
            return '0' + num;

        return num;
    }


    return (
        <div className="clock-container">
            { 
                addZero( currentTime.getHours() )   + ':' + 
                addZero( currentTime.getMinutes() ) 
                // + ':' + 
                // addZero( currentTime.getSeconds() ) 
            }
        </div>
    )
}
