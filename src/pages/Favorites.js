import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import WeatherData from '../models/WeatherData';
import { favoritesActions } from '../store';


export default function Favorites() {
    const favorites = useSelector(state => state);
    const dispatch = useDispatch();

    function addHandler(){
      const newObj = { city: 'miami', temperature: '17', description: 'sunny', icon: "icon23 ", key:'4234'};
      dispatch(favoritesActions.add(newObj));
    }
    
    function deleteHandler(key){
      dispatch(favoritesActions.delete(key))
    }

    return (
        <div>
            {favorites.map(item => (
                <div key={item.key}>
                    <h1>{item.city}</h1>
                    <h1>{item.description}</h1>
                    <h1>{item.temperature}°C</h1>
                    <h1>{item.icon}</h1>
                    <button onClick={() => deleteHandler(item.key)}>remove from favorites</button>
                    
                    </div>
            ))}
        <button onClick={addHandler}>add city</button>
        </div>
    );
}
