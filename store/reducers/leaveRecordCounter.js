import { createSlice } from '@reduxjs/toolkit'
import produce from "immer"
const initialState = {
    leaveCounter: null
}

export const LeaveRecordCounter = createSlice({
    name: 'leaveCounter',
    initialState,
    reducers: {
        leaveCounterHandler: (state, action) => {

            const nextState = produce(state.leaveCounter, draftState => {
                draftState = action.payload
                return draftState;
            })
            state.leaveCounter = nextState
        },
    },
})

// Action creators are generated for each case reducer function
export const { leaveCounterHandler } = LeaveRecordCounter.actions

export default LeaveRecordCounter.reducer