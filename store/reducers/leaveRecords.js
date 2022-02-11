import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"
const initialState = {
    leaveData: []
}

export const leaveRecordsData = createSlice({
    name: 'leaveData',
    initialState,
    reducers: {
        leaveRecordsHandler: (state, action) => {

            const nextState = produce(state.leaveData, draftState => {
                draftState = action.payload
                return draftState;
            })
            state.leaveData = nextState
        },
    },
})

// Action creators are generated for each case reducer function
export const { leaveRecordsHandler } = leaveRecordsData.actions

export default leaveRecordsData.reducer