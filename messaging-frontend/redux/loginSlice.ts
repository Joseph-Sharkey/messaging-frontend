//the next move is to create the redux store to store whether the user is logged in 

import { createSlice } from "@reduxjs/toolkit";

interface login {
	value: boolean

}

const initialState: login = {
	value: false
}

const loginSlice = createSlice({
	name: "login",
	initialState,
	reducers: {
		login(state) {
			state.value = true;
		},
		logout(state) {
			state.value= false;
		}
	}
});

export const { login, logout } = loginSlice.actions;
export default loginSlice.reducer;

