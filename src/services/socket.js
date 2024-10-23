class socket  {
    connect_socket(id){
        const socket = new WebSocket('ws://103.168.58.235:65534/ws/'+id);
        return socket
    }
}
export default  new socket();
 