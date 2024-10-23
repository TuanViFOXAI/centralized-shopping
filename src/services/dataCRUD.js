import API from '../apis/api'

class CRUD {
    

    getData(api,params) {
        return API.get_all_v2(api, {data: params});
    }
    
   async Create  (api,data){
    const message = null;
    return data
   }

}

export default new CRUD();