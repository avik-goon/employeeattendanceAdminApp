import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    employee: []
}

export const employeeList = createSlice({
    name: 'user',
    initialState,
    reducers: {
        employeEvent: (state, action) => {
            state.employee = [...action.payload]
        },
    },
})

// Action creators are generated for each case reducer function
export const { employeEvent } = employeeList.actions

export default employeeList.reducer