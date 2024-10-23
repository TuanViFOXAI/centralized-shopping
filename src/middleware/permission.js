
const menu = [];
function getMenu(data){
    for (let index = 0; index <data.length; index++) {
        const item =data[index];
        if(item.Link){
            menu.push({
                Authorization:item.Authorization,
                Link:item.Link
            })
        }
        if(item.children){
            getMenu(item.children)
        }
    }
    return menu;
}
export default function permission({ to, from, next, router }) {
    const pathRoute = to.path.replace("/", "");
  
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      const menu = getMenu(user['menu'].data);
      const check_permission = menu.filter((val) => {
        return val.Link === pathRoute
      });
  
      if (!check_permission.length) {
        router.push({ name: 'Access' });
      }
    }
    next(); // Move this line outside the conditional block
  }