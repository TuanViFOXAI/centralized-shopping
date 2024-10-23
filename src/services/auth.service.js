import axios from 'axios';
import cookie from '../service/CookieService';

const API_URL = import.meta.env.VITE_APP_API_PM;

class AuthService {
    login(user) {
        const data ={
            'Email': user.username,
            'Password': user.password
        }
        return axios
            .post(API_URL + 'login', data)
            .then(response => {

                if (response.data) {
                    const currentDate = new Date();
                    const expireTokenTime = new Date(currentDate.getTime() + response.data["ExpiresIn"] * 60 * 1000).toString();
                    const jToken = {ExpireToken: expireTokenTime,...response.data}
                    localStorage.setItem('user', JSON.stringify(jToken));
                    cookie.set('user_type', response.data.UserType=='Buying'? 'business':'supplier',365);
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
        cookie.set('user_type', '',1);
    }

    register(user) {
        return axios.post(API_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();