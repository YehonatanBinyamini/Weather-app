import { createSlice, configureStore } from '@reduxjs/toolkit'
// import WeatherData from '../models/WeatherData'

    const initialState = [{city: 'Haifa', temperature: '31', description: 'daily', icon: "icon ", key: '3333'}];
    const favoritesSlice = createSlice({
        name: 'favorites',
        initialState,
        reducers: {
            add(state, action){
                return [...state,action.payload]
            },
            delete(state, action){
                const updatedState = state.filter( item => item.key !== action.payload)
                return updatedState;
            }
        }

    })  

export const favoritesActions = favoritesSlice.actions;

export const store = configureStore({
    reducer: favoritesSlice.reducer
})

