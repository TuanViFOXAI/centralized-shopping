import axios from 'axios';
const API_URL_V2 = import.meta.env.VITE_APP_API_PM;

export default function auth({ next, router }) {
  if (!localStorage.getItem('user')) {
    return router.push({ name: 'login' });
  }
  else{
    try{
      const user = JSON.parse(localStorage.getItem('user'));
      const expireDate = new Date(user["ExpireToken"]);
      if(expireDate <= new Date()){
        if(user['RefreshToken']){
          axios.get(API_URL_V2+'user/token?id='+user["UserID"],{ headers: { Authorization: 'Bearer ' + user['RefreshToken'] } }).then((response)=>{
            const currentDate = new Date();
            const expireTokenTime = new Date(currentDate.getTime() + response.data["ExpiresIn"] * 60 * 1000).toString();
            const jToken = {ExpireToken: expireTokenTime,menu:user['menu'],...response.data}
            localStorage.setItem('user', JSON.stringify(jToken));
            cookie.set('user_type', response.data.UserType=='Buying'? 'business':'supplier',365);
          });
        }else{
          return router.push({ name: 'login' });
        }
      }
      return next();
    }
    catch(ex) {
      return router.push({ name: 'login' });
    }
  }
}