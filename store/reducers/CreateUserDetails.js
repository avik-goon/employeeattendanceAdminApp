import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: []
}

export const userDetails = createSlice({
    name: 'user',
    initialState,
    reducers: {
        createUser: (state, action) => {
            state.user = [...action.payload]
        },
    },
})

// Action creators are generated for each case reducer function
export const { createUser } = userDetails.actions

export default userDetails.reducer