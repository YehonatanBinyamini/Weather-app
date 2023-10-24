import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import WeatherData from '../models/WeatherData';

export default function Favorites() {
    const favorites = useSelector(state => state);
    const dispatch = useDispatch();

    function addHandler(){
      dispatch({type: 'add', newObject: new WeatherData('miami', '17', 'sunny', "icon23 ", '4234')})
    }
    
    function deleteHandler(){
      dispatch({type: 'delete', key: "4234"})
    }

    return (
        <div>
            {favorites.map(item => (
                <div key={item.key}>
                    <h1>{item.city}</h1>
                    <h1>{item.description}</h1>
                    <h1>{item.temperature}°C</h1>
                    <h1>{item.icon}</h1>
                    
                    </div>
            ))}
        <button onClick={addHandler}>add city</button>
        <button onClick={deleteHandler}>delete city</button>
        </div>
    );
}
