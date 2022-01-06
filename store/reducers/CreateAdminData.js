import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"
const initialState = {
    adminData: [{
        name: '',
        imageURL: '',
        fileName: '',
        id: ''
    }]
}

export const adminData = createSlice({
    name: 'adminData',
    initialState,
    reducers: {
        createAdminData: (state, action) => {

            const nextState = produce(state.adminData, draftState => {
                draftState = [...action.payload]
                return draftState;
            })
            state.adminData = nextState
        },
    },
})

// Action creators are generated for each case reducer function
export const { createAdminData } = adminData.actions

export default adminData.reducer