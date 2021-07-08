const Services=require('../services/service.js');

class Controller {
    constructor() {
        this.service=new Services();
    }
    //Controlador para crear .
    create=async ({body},res) => {
        let response={};
        try {
            response=await this.service.create(body);
        } catch(err) {
            response=err;
        }
        res.status(200).json(response);
    }
    //Controlador para actualizar .
    update=async ({body},res) => {
        let response={};
        try {
            response=await this.service.update(body);
        } catch(err) {
            response=err;
        }
        res.status(200).json(response);
    }
    //Controlador para eliminar .
    delete=async ({params},res) => {
        let response={};
        const {id}=params;
        try {
            response=await this.service.delete(id);
        } catch(err) {
            response=err;
        }
        res.status(200).json(response);
    }
    //Controlador para traer a todo.
    getAlls=async (req,res) => {
        let response={};
        try {
            response=await this.service.getAlls();

        } catch(err) {
            response=err;
        }
        res.status(200).json(response);
    }
    //Controlador para traer a un solo .
    get=async ({params},res) => {
        let response={};
        const {id}=params;
        try {
            response=await this.service.get(id);
        } catch(err) {
            response=err;
        }
        res.status(200).json(response);
    }
}
module.exports=Controller;