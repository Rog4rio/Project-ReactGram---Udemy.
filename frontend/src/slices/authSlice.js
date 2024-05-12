import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import authService from '../services/authService' // Dele vem as funções para executar no sistema.

const user = JSON.parse(localStorage.getItem("user")) // Para pegar o usuário caso tenha.

const initialState = {
    user: user ? user : null, // O usuário vai ser preenchido pelo usuário caso tenha cadastrado, se não, vai retornar null
    error: false,
    success: false,
    loading: false,
};

//Register an user and sign in
export const register = createAsyncThunk("auth/register", // Criar a função com o asyncThunk, damos um nome para a função e o nome segue o padrão de levar o nome da entidade que estamos trabalhando e também o nome da ação atual. 
 async(user, thunkAPI) => { // O segundo argumento é a função que também é assíncrona, onde recebe-se o usuário e a thunkAPI que nos permite usar funções extras.

    const data = await authService.register(user) // O user vai ser passado como componentes do objeto register.

    // check for errors
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]) // Rejeitando a requisição caso tenha algo errado.
    }

    return data;

});

// Logout an user
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
});

//Sing in an user
export const login = createAsyncThunk("auth/login", // Criar a função com o asyncThunk, damos um nome para a função e o nome segue o padrão de levar o nome da entidade que estamos trabalhando e também o nome da ação atual. 
 async(user, thunkAPI) => { // O segundo argumento é a função que também é assíncrona, onde recebe-se o usuário e a thunkAPI que nos permite usar funções extras.

    const data = await authService.login(user) // O user vai ser passado como componentes do objeto login.

    // check for errors
    if(data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]) // Rejeitando a requisição caso tenha algo errado.
    }

    return data;

});

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => { // Serve para resetar todos os estados.
            state.loading = false;
            state.error = false;
            state.success = false;
        },
    },
    extraReducers: (builder) => { // Faz parte das execuções da API. E o builder é o argumento de consultor.
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(register.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload; //Pegar um erro e exibir na tela.
            state.user = null;
        }).addCase(logout.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = null;
        }).addCase(login.pending, (state) => {
            state.loading = true;
            state.error = false;
        }).addCase(login.fulfilled, (state, action) => { // Quando eu tenho um state e uma action. Para quando der tudo certo na requisição
            state.loading = false;
            state.success = true;
            state.error = null;
            state.user = action.payload;
        }).addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload; //Pegar um erro e exibir na tela.
            state.user = null;
        });
    },
});

export const {reset} = authSlice.actions
export default authSlice.reducer;