const usersClass=require('../services/service.users.js');

class controllerUsers {
  constructor() {
    this.user=new usersClass();
  }

  create=async ({body},res) => {

    const {fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,password,color,status}=body;
    let response={};
    try {
      response=await this.user.create(fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,password,color,status);
    } catch(err) {
      console.log(err);
    }
    res.json(response)
  }

  update=async ({body},res) => {
    const {idUser,fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,color,password,status}=body;
    let response={};
    try {
      response=await this.user.update(idUser,fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,color,password,status);
    } catch(err) {
      response=err;
    }
    res.json(response)
  }
  delete=async ({params},res) => {
    const {idUser}=params;
    let response={};
    try {
      response=await this.user.delete(idUser);
    } catch(err) {
      response=err;
    }
    res.json(response)
  }
  getAll=async (req,res) => {
    let response={};
    try {
      response=await this.user.getAll();
      res.json(response);

    } catch(err) {
      response=err;
      res.json(response);
    }
  }
  get=async ({params},res) => {
    let {idUser}=params;
    let response={};
    try {
      response=await this.user.get(idUser);
    } catch(err) {
      response=err;
    }
    res.json(response)
  }
  getNominas=async (_,res) => {
    this.user.getNominas()
      .then(response => res.json(response))
      .catch(err => res.json(err))
  }
  getPodologos=async (req,res) => {
    let response={};
    try {
      response=await this.user.getPodologos();
      res.json(response);

    } catch(err) {
      response=err;
      res.json(response);
    }
  }
}
module.exports=controllerUsers;