import Api from "./Api";

export default{
    menuGet(){
        return Api().get(`/dishes`);
    },
    menuSubmit(data){
        return Api().put("/dishes",data)
    },
    menuUpdate(data){
        return Api().put(`/dishes`,data);
    },
    menuDelete(data){
        return Api().delete(`/dishes/${data._id}`);
    },
};