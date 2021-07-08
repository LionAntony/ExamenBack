const MysqlLib=require('../../lib/mysql.js');
class Empresas {
	constructor() {
		this.Table='cat_empresas';
		this.Mysql=new MysqlLib();
		/**
		 * CheckExist se encargara de verificar si existe la empresa
		 */
		this.CheckExist=async (nombre='') => {
			let state={exist: false,err: false};

			let user=await this.Mysql.get(this.Table,['nombre'],{nombre});
			console.log(user);
			if(user.length>0) {
				state.exist=true;
				state.err='Hay un empresa con el mismo nombreaa';
				return state;
			}
			return state;
		}
	}
	/**
	 * create sirve para registrar una nueva empresa
	 * @param {string} nombre Es el nombre de la nueva empresa
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async create({nombre=''}) {
		let state={status: true,err: false,data: false};
		const Fields=['nombre'];
		const Values=[nombre];
		try {
			const exist=await this.CheckExist(nombre);
			if(exist.exist) {
				state.status=false;
				state.err=exist.err;
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
	 * update sirve para actualizar los datos de una empresa
	 * @param {integer} id Es el id de la empresa 
	 * @param {string} nombre Es el nombre de la empresa 
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async update({id=0,nombre=''}) {
		let state={status: true,err: false};
		const updateData={idcat_empresas: id,nombre: nombre};
		const condition={idcat_empresas: id};
		try {

			const exist=await this.CheckExist(nombre);
			if(exist.exist) {
				state.status=false;
				state.err=exist.err;
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
		const condition={idcat_empresas: id};
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
	 * getAlls se encarga de traer a todas las empresas
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * 		data: [] | Con las empresas
	 * }
	 */
	async getAlls() {
		let state={status: true,err: false,data: []};
		try {
			let empresas=await this.Mysql.getAll(this.Table);
			state.data=empresas;
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer a los empresas';
			return state;
		}
	}
	/**
	 * getEmpresas Se encargara de traer los datos de la empresa que le pidamos.
	 * @param {integer} id Es el id de la empresa que traeremos y sus datos correspondientes
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * 		data:{} | un objeto con los datos de la empresa.
	 * } 
	 */
	async get(id=0) {
		let state={status: true,err: false,data: {}};
		const condition={idcat_empresas: id};
		try {
			const [empresa]=await this.Mysql.getAll(this.Table,condition);
			state.data={...empresa};
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer al empresa.';
			return state;
		}
	}
}
module.exports=Empresas;