export default function check_account({ next, router }) {
    const user = JSON.parse(localStorage.getItem('user'));

        if (user["UserType"]=="Buying" ) {
            return router.push({ name: 'buyer' });
        }
        else{
            return router.push({ name: 'supplier' });
        }
}