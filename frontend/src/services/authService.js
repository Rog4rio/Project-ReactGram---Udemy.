// Serviço para autenticação do usuário

import {api, requestConfig} from '../utils/config'

// Register an user
const register = async(data) => {
    
    const config = requestConfig("POST", data)

    try {
        
        const res = await fetch(api + "/users/register", config).then((res) => res.json()).catch((err) => err); // then é para receber dados

        if(res._id) {
            localStorage.setItem("user", JSON.stringify(res)); // Para salvar o usuário pelo id do token e depois resgatar.
        }
        return res;
    } catch (error) {
        console.log(error);
    }
};

// Logout an user
const logout = () => {
    localStorage.removeItem("user");
}

// Sign in an user
const login = async(data) => {

    const config = requestConfig("POST", data);
    try {
        
        const res = await fetch(api + "/users/login", config).then((res) => res.json()).catch((err) => err)
        if(res._id) {
            localStorage.setItem("user", JSON.stringify(res))
        }
        return res;
    } catch (error) {
        console.log(error)
    }

}

const authService = {
    register,
    logout,
    login,
}

export default authService;