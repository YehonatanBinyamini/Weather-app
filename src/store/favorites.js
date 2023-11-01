import { createSlice } from '@reduxjs/toolkit'

const initialState = {favoritesList: []};
const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        add(state, action){
            state.favoritesList.push(action.payload)
        },
        delete(state, action){
            const updatedState = state.favoritesList.filter( item => item.key !== action.payload)
            return {favoritesList: updatedState};
        }
    }

})  

export const favoritesActions = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;