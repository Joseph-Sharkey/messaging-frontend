import { createSlice } from "@reduxjs/toolkit";

interface user {
	userNumber: null|number,
	username: string,
	description: string
};

const initialState: user = {
	userNumber: null,
	username: "",
	description: "", 
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		changeNumber(state, action) {
			state.userNumber = action.payload
		},
		changeUsername(state, action) {
			state.username = action.payload
		},
		changeDescription(state, action) {
			state.description = action.payload
		}
	}
});

export const {changeNumber, changeUsername, changeDescription} = userSlice.actions;
export default userSlice.reducer;

