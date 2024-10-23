import vi from './vi.json';
import en from './en.json';
import { createI18n } from 'vue-i18n';
import cookie from '../service/CookieService';

const localeCookie = (defaultLang) => {
    if(cookie.get('lang')){
        return cookie.get('lang');
    }
    else{
        cookie.set('lang',defaultLang,30)
        return defaultLang;
    }
}

const i18n = createI18n({
    // something vue-i18n options here ...;
    legacy: false,
    locale: localeCookie('vi'),
    // fallbackLocale: 'en',
    messages: {
        vi: vi,
        en: en
    }
});
export default i18n;
