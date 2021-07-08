const MysqlLib=require('../../lib/mysql.js');
class Empresas {
	constructor() {
		this.Table='cat_departamento';
		this.TableEmp='cat_empresas';
		this.Mysql=new MysqlLib();
		/**
		 * CheckExist se encargara de verificar si existe el departamento
		 */
		this.CheckExist=async (nombre='',empresa='') => {
			let state={exist: false,err: false};

			let user=await this.Mysql.get(this.Table,['nombre','fk_empresa'],{nombre: nombre,fk_empresa: empresa});
			console.log(user);
			if(user.length>0) {
				state.exist=true;
				state.err='Hay tienes registrado este departamento';
				return state;
			}
			return state;
		}

		/**
		 * CheckExist se encargara de verificar si existe la empresa
		 */
		this.CheckExistEMPresa=async (id='') => {
			let state={exist: false,err: false};

			let user=await this.Mysql.get(this.TableEmp,['idcat_empresas'],{idcat_empresas: id});
			console.log(user);
			if(user.length>0) {
				state.exist=true;
				state.err='Si existe la empresa';
				return state;
			}
			return state;
		}
	}
	/**
	 * create sirve para registrar una nueva empresa
	 * @param {string} nombre Es el nombre de la nueva empresa
	 * @param {integer} empresa Es el id de la empresa
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async create({nombre='',empresa='',}) {
		let state={status: true,err: false,data: false};
		const Fields=['nombre','fk_empresa'];
		const Values=[nombre,empresa];
		try {
			const exist=await this.CheckExist(nombre,empresa);
			if(exist.exist) {
				state.status=false;
				state.err=exist.err;
				return state;
			}

			const existEmp=await this.CheckExistEMPresa(empresa);
			if(!existEmp.exist) {
				state.status=false;
				state.err='no existe la empresa';
				return state;
			}

			let {affectedRows,insertId}=await this.Mysql.insert(this.Table,Fields,Values);
			if(affectedRows&&affectedRows>0) {
				state.data=insertId;
				return state;
			}
			state.status=false;
			state.err='No se pudo registrar la nueva empresa.';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al registrar la nueva empresa.'
		}
	}
	/**
	 * update sirve para actualizar los datos de una departamento
	 * @param {integer} id Es el id del departamento 
	 * @param {string} nombre Es el nombre del departamento 
	 * @param {integer} empresa Es el id de la empresa
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async update({id=0,nombre='',empresa=''}) {
		let state={status: true,err: false};
		const updateData={idcat_departamento: id,nombre: nombre,fk_empresa: empresa};
		const condition={idcat_departamento: id};
		try {

			const exist=await this.CheckExist(nombre);
			if(exist.exist) {
				state.status=false;
				state.err=exist.err;
				return state;
			}
			const existEmp=await this.CheckExistEMPresa(empresa);
			if(!existEmp.exist) {
				state.status=false;
				state.err='no existe la empresa';
				return state;
			}

			const {affectedRows}=await this.Mysql.update(this.Table,updateData,condition);
			if(affectedRows&&affectedRows>0) {
				return state;
			}
			state.status=false;
			state.err='No se pudo actualizar la empresa';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al actualizar la empresa.';
			return state;
		}
	}
	/**
	 * delete Se encarga de eliminar una empresa.
	 * @param {integer} id Es el id de le empresa.
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async delete(id) {
		let state={status: true,err: false};
		const condition={idcat_departamento: id};
		try {
			const {affectedRows}=await this.Mysql.delete(this.Table,condition);
			if(affectedRows&&affectedRows>0) {
				return state;
			}
			state.status=false;
			state.err='No se pudo eliminar la empresa';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al eliminar la empresa';
			return state;
		}
	}
	/**
	 * getAlls se encarga de traer a todo
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * 		data: [] | Con los datos
	 * }
	 */
	async getAlls() {
		let state={status: true,err: false,data: []};
		try {
			let departamentos=await this.Mysql.free('call getCatDepartamento');
			state.data=departamentos;
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer a los departamentos';
			return state;
		}
	}
	/**
	 * getEmpresas Se encargara de traer los datos de la departamento que le pidamos.
	 * @param {integer} id Es el id de la departamento que traeremos y sus datos correspondientes
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * 		data:{} | un objeto con los datos de la departamento.
	 * } 
	 */
	async get(id=0) {
		let state={status: true,err: false,data: {}};
		try {
			const [departamento]=await this.Mysql.free(`call getOneDepartamento (${id})`);
			state.data={...departamento};
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer al departamento.';
			return state;
		}
	}
}
module.exports=Empresas;