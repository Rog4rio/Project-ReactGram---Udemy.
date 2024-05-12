import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import userService from '../services/userService'

const initialState = {
    user: {},
    error: false,
    success: false,
    loading: false,
    message: null
}

// funções

// Get user details. Pegar os detalhes do usuário para preencher o form do user.
export const profile = createAsyncThunk("user/profile",
    async(user, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token; // pegar dados do redux através da thunkAPI. Pegando o token que está sallvo no authSlice.


        const data = await userService.profile(user, token); // Pegando o o usuário pelo token.

        return data;
    }
);


// Update user details
export const updateProfile = createAsyncThunk(
    "user/update",
    async(user, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token;

        const data = await userService.updateProfile(user, token);

        // Check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }
        return data;
    }
);


// Get user details
export const getUserDetails = createAsyncThunk(
    "user/get",
    async(id, thunkAPI) => {

        const data = await userService.getUserDetails(id);
        return data;
    }
)



export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(profile.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(profile.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(updateProfile.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
            state.message = "Usuário atualizado com sucesso!"
        }).addCase(updateProfile.rejected, (state, action) => {
            console.log(state, action)
            state.loading = false;
            state.error = action.payload; //Pegar um erro e exibir na tela.
            state.user = {};
        }).addCase(getUserDetails.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(getUserDetails.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        });
    }
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;