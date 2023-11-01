import { configureStore } from '@reduxjs/toolkit'
import { favoritesReducer } from './favorites'
import { citiesReducer } from './citiesData'
import { unitsReducer } from './unitsReducer'

export const store = configureStore({
    reducer: {favorites: favoritesReducer, cities: citiesReducer, units: unitsReducer}
})

