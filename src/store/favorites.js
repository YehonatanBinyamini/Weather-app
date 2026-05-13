import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "weatherApp.favorites";

const loadFavorites = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (err) {
        console.error("Failed to load favorites from localStorage:", err);
        return [];
    }
};

const saveFavorites = (list) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
        console.error("Failed to save favorites to localStorage:", err);
    }
};

const initialState = { favoritesList: loadFavorites() };
const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        add(state, action) {
            const exists = state.favoritesList.some(
                (item) => item.key === action.payload.key
            );
            if (!exists) {
                state.favoritesList.push(action.payload);
                saveFavorites(state.favoritesList);
            }
        },
        delete(state, action) {
            const updatedState = state.favoritesList.filter(
                (item) => item.key !== action.payload
            );
            saveFavorites(updatedState);
            return { favoritesList: updatedState };
        },
        // optional: set entire favorites list
        setAll(state, action) {
            state.favoritesList = action.payload || [];
            saveFavorites(state.favoritesList);
        },
    },
});

export const favoritesActions = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;