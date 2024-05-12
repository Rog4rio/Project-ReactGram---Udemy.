import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux' // Serve para pegar os dados que estão na store do auth.

export const useAuth = () => {

    const {user} = useSelector((state) => state.auth);

    const [auth, setAuth] = useState(false);
    const [loading, setLoading] = useState(true); // Sempre que o usuário der um refresh na tela para desbugar alguma coisa, essa é a maneira de resgatar o usuário logado.

    useEffect(() => { // Para ser ativado sempre que o usuário logar.

        if(user) {
            setAuth(true); // se o usuario estiver logado.
        }else {
            setAuth(false);
        }

        setLoading(false);


    }, [user])

    return {auth, loading};

}