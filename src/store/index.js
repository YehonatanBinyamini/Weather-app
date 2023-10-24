import { createStore } from 'redux'
import WeatherData from '../models/WeatherData'

const favoritesReducer = (state = [new WeatherData('tel aviv', '23', 'daily', "icon ", '3333')], action) => {
    if (action.type === "add") {
        return [...state, action.newObject];
    }

    if (action.type === "delete") {
        const updatedFavorites = state.filter(item => item.key !== action.key);
        return [...updatedFavorites];
    }

    return state;
};


export const store = createStore(favoritesReducer)
