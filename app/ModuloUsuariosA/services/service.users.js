'use strict';
const mysqlLib=require('../../lib/mysql.js');
const bcrypt=require('bcrypt');
/**
 * Users se encargara de darnos la logica de los usuarios
 * de la plataforma.
 */
class Users {
    constructor() {
        this.tableUser='cat_usuario';
        this.Mysql=new mysqlLib();
        this.tableSecciones='secciones_rol';
        /**
         * UserExist nos dirá si el usuario existe por medio de su nombre o su correo
         * @param {string} nombre Es el nombre principal del usuario 
         * @param {string} apellidoP Es el apellido paterno del usuario 
         * @param {string} apellidoM Es el apellido materno del usuario
         * @param {string} correo Es el correo que usara el usuario 
         */
        this.UserExist=async function(nombre='',apellidoP='',apellidoM='',correo='') {
            let stateFunction={exist: true,err: false};
            const conditionsForName={nombre,apellidoP,apellidoM};
            const UserForName=await this.Mysql.getAll(this.tableUser,conditionsForName);
            const VerifyEmail=await this.EmailExist(correo);
            if(UserForName&&UserForName.length>0) {
                stateFunction.err='Existe un usuario con el mismo nombre.';
                return stateFunction;
            } else if(VerifyEmail) {
                stateFunction.err='Existe un usuario con el mismo correo.';
                return stateFunction;
            } else {
                stateFunction.exist=false;
                return stateFunction;
            }
        }
        /**
         * La función EmailExist nos ayudará a saber si el email existe en
         * algún usuario
         * @param {string} correo Es el correo que veremos si existe o no. 
         */
        this.EmailExist=async function(correo='') {
            const conditionsForEmail={correo};
            const UserForEmail=await this.Mysql.getAll(this.tableUser,conditionsForEmail);
            if(UserForEmail&&UserForEmail.length>0) {
                return true;
            }
            return false;
        }
    }
    /**
     * La función create nos ayudara a crear una cuenta de usuario para la plataforma
     * @param {integer} fk_tipo_nomina Es el tipo de nomina que manejara el usuario
     * de la cuenta.
     * @param {string} nombre Es el nombre del usuario 
     * @param {string} apellidoP Es el apellido paterno del usuario
     * @param {string} apellidoM Es el apellido materno del usuario
     * @param {string} correo Es el correo del usuario
     * @param {string} password Será la password inicial del usuario
     * @param {integer} pin Será el pin personal del medico, el cual está compuesto
     * de cuatro digitos
     */
    async create(fk_tipo_nomina=0,nombre='',apellidoP='',apellidoM='',correo='',password='',color='',status=1) {
        let state={status: true,err: false,data: {}};
        try {
            const saltRounds=10;
            const passwordHashed=await bcrypt.hash(password,saltRounds);
            const UserExist=await this.UserExist(nombre,apellidoP,apellidoM,correo);
            if(!UserExist.exist) {
                let fields=['fk_tipo_nomina','nombre','apellidoP','apellidoM','correo','password','changePassword','pin','color','rol','status'];
                let values=[fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,passwordHashed,1,1234,color,fk_tipo_nomina,status];
                const {affectedRows,insertId}=await this.Mysql.insert(this.tableUser,fields,values);
                if(affectedRows&&affectedRows===1) {
                    state.data=insertId;
                } else {
                    state.status=false;
                    state.err='Hubo un error al crear el usuario, por favor intentarlo más tarde.';
                }
            } else {
                state.status=false;
                state.err=UserExist.err;
            }
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state;
        }
    }

    /**
     * La función update nos ayudará a actualizar alguna información del usuario en caso de así
     * ser necesario.
     * @param {integer} idUser Es el id del usuario que será actualizado
     * @param {string} fk_tipo_nomina Es la nomina actual del usuario
     * @param {string} nombre Si hubo algún error en el nombre, actualizandolo podrá ser corregido
     * @param {string} apellidoP Si hubo algún error en el apellido paterno, actualizandolo podrá ser corregido
     * @param {string} apellidoM Si hubo algún error en el apellido materno, actualizandolo podrá ser corregido
     * @param {string} correo Si el correo del usuario cambio podrá ser actualizado
     */
    async update(idUser=0,fk_tipo_nomina='',nombre='',apellidoP='',apellidoM='',correo='',color='',password='',status='1') {
        let state={status: true,err: false};
        try {
            const [User]=await this.Mysql.get(this.tableUser,['correo'],{idcat_usuario: idUser});
            let editUser=true;
            if(User&&User.correo!==correo) {
                const EmailExist=await this.EmailExist(correo);
                if(EmailExist) {
                    editUser=false;
                    state.status=false;
                    state.err='El email que se intenta cambiar ya está siendo ocupado por otro usuario.';
                }
            }
            if(editUser) {
                const fieldsAndValues={fk_tipo_nomina,nombre,apellidoP,apellidoM,correo,color,status};
                const {affectedRows}=await this.Mysql.update(this.tableUser,fieldsAndValues,{idcat_usuario: idUser});
                await this.updatePassword(idUser,password);
                if(affectedRows===0) {
                    state.status=false;
                    state.err='Hubo un error al actualizar los datos.'
                }
            }
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state;
        }
    }
    /**
     * updatePassword se encargará de actualizar la password del usuario en caso de que este
     * la haya olvidado, se actualizará mediante el token que se le enviará de 
     * verificación a su correo.
     * @param {number} idUser Es el id con el cual verificaremos que usuario es al que se le cambiará
     * la password.
     * @param {string} newPassword Será la nueva contraseña con la cual el usuario podrá volver a entrar a su
     * cuenta.
     */
    async updatePassword(idUser=0,newPassword='') {
        let state={}
        try {
            if(newPassword.length!==0) {
                const DataUser=await this.Mysql.get(this.tableUser,['token'],{idcat_usuario: idUser});
                if(DataUser.length!==0) {
                    const saltRounds=10;
                    const passwordHashed=await bcrypt.hash(newPassword,saltRounds);
                    const fieldsAndValues={password: passwordHashed};
                    await this.Mysql.update(this.tableUser,fieldsAndValues,{idcat_usuario: idUser});
                    return state;
                }
            }
        } catch(err) {
            state.status=false;
            state.err=err;
            return state;
        }
    }
    /**
     * deleteUser se encargara de eliminar al usuario en concreto, eliminando todo su historial.
     * @param {integer} idUser Es el id del usuario a ser eliminado. 
     */
    async delete(idUser=0) {
        let state={status: true,err: false};
        try {
            await this.Mysql.delete(this.tableUser,{idcat_usuario: idUser});
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state;
        }
    }
    /**
     * getAll se encargará de traer los datos de todos los usuarios de la aplicación
     */
    async getAll() {
        let state={status: true,err: false,data: []};
        try {
            const Users=await this.Mysql.getAll(this.tableUser);

            state.data=Users;
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            throw new Error(state);
        }
    }
    /**
     * get traera los datos de un solo usuario de la aplicación
     * @param {integer} idUser 
     */
    async get(idUser=0) {
        let state={status: true,err: false,data: {}};
        try {
            let condition={idcat_usuario: idUser};
            let getData=['idcat_usuario','fk_tipo_nomina','nombre','apellidoP','apellidoM','correo','color'];
            const [UserData]=await this.Mysql.get(this.tableUser,getData,condition);
            if(UserData) {
                state.data={...UserData};
                return state;
            }
            state.err='NotData';
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state;
        }
    }
    /**
     * getFullDataUser Traeremos todos los datos de un usuario que seleccionemos por
     * medio de su correo.
     * @param {string} correo Es el correo del usuario el cual buscaremos. 
     */
    async getFullDataUser(correo='') {
        let state={status: true,err: false,data: {}};
        try {
            const condition={correo};
            const [user]=await this.Mysql.getAll(this.tableUser,condition);
            const secciones=await this.getSecciones(user.idcat_usuario);
            if(user) {
                state.data={...user,secciones};
                return state;
            }
            state.status=false;
            state.err='No hay datos';
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state
        }
    }
    async getFullDataUserForLogin(correo='') {
        let state={status: true,err: false,data: {}};
        try {
            const condition={correo};
            const query=`SELECT * from cat_usuario where correo='${correo}' and status=1`;
            const [user]=await this.Mysql.free(query);
            const secciones=await this.getSecciones(user.fk_tipo_nomina);
            if(user) {
                state.data={...user,secciones};
                return state;
            }
            state.status=false;
            state.err='No hay datos';
            return state;
        } catch(err) {
            state.status=false;
            state.err=err;
            return state
        }
    }


    async getSecciones(idRol) {
        let SeccionesUsuario=[];
        try {
            const secciones=await this.Mysql.free(`call getSecciones(${idRol})`);
            console.log(JSON.parse(JSON.stringify(secciones[0])));
            for await(let seccion of JSON.parse(JSON.stringify(secciones[0]))) {
                SeccionesUsuario.push({
                    label: seccion.nombre,
                    icon: seccion.icon,
                    to: seccion.url,
                    Compo: seccion.componente
                })
            }
        } catch(err) {
            console.log(err);
        }
        return SeccionesUsuario;
    }

    async getPodologos() {
        const condition={fk_tipo_nomina: 2};
        let state={status: true,err: false,data: []}
        try {
            const podologos=await this.Mysql.getAll(this.tableUser,condition);
            state.data=podologos;
            return state;
        } catch(err) {
            return {status: false,err: 'err_get_nomina',data: []}
        }
    }
}
module.exports=Users;