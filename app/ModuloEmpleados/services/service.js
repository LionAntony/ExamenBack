const MysqlLib=require('../../lib/mysql.js');
class Empresas {
	constructor() {
		this.Table='cat_empleados';
		this.TableDepto='cat_departamento';
		this.TableEmp='cat_empresas';
		this.Mysql=new MysqlLib();
		/**
		 * CheckExist se encargara de verificar si existe el empleado
		 */
		this.CheckExist=async (nombre='',
			apellidoP='',
			apellidoM='',
			fechaNacimiento='',
			correo='',) => {
			let state={exist: false,err: false};

			let user=await this.Mysql.get(this.Table,[
				'nombre',
				'apellidoP',
				'apellidoM',
				'fechaNacimiento',],{
				nombre: nombre,
				apellidoP: apellidoP,
				apellidoM: apellidoM,
				fechaNacimiento: fechaNacimiento,
			});
			console.log(user);
			if(user.length>0) {
				state.num=user.length
				state.exist=true;
				state.err='Ya tienes registrado este empleado';
				return state;
			}
			return state;
		}

		/**
		 * CheckExist se encargara de verificar si existe el departamento
		 */
		this.CheckExistDpto=async (id='') => {
			let state={exist: false,err: false};

			let user=await this.Mysql.get(this.TableDepto,['idcat_departamento'],{idcat_departamento: id});
			console.log(user);
			if(user.length>0) {
				state.num=user.length
				state.exist=true;
				state.err='Si existe el departamento';
				return state;
			}
			return state;
		}
	}
	/**
	 * create sirve para registrar un nuevo empleado
	*@param {integer} departamento
	*@param {String} nombre
	*@param {String} apellidoP
	*@param {String} apellidoM
	*@param {date} fechaNacimiento
	*@param {String} correo
	*@param {String} genero
	*@param {String} telefono
	*@param {String} celular
	*@param {date} fechaIngreso
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async create({
		departamento='',
		nombre='',
		apellidoP='',
		apellidoM='',
		fechaNacimiento='',
		correo='',
		genero='',
		telefono='',
		celular='',
		fechaIngreso='',
	}) {
		let state={status: true,err: false,data: false};
		const Fields=['fk_departamento',
			'nombre',
			'apellidoP',
			'apellidoM',
			'fechaNacimiento',
			'correo',
			'genero',
			'telefono',
			'celular',
			'fechaIngreso'];
		const Values=[departamento,
			nombre,
			apellidoP,
			apellidoM,
			fechaNacimiento,
			correo,
			genero,
			telefono,
			celular,
			fechaIngreso];
		try {
			const exist=await this.CheckExist(nombre,
				apellidoP,
				apellidoM,
				fechaNacimiento,
				correo);
			if(exist.exist) {
				state.status=false;
				state.err=exist.err;
				return state;
			}

			const existEmp=await this.CheckExistDpto(departamento);
			if(!existEmp.exist) {
				state.status=false;
				state.err='no existe el departamento';
				return state;
			}

			let {affectedRows,insertId}=await this.Mysql.insert(this.Table,Fields,Values);
			if(affectedRows&&affectedRows>0) {
				state.data=insertId;
				return state;
			}
			state.status=false;
			state.err='No se pudo registrar el nuevo empleado.';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al registrar el nuevo empleado.'
		}
	}
	/**
	 * update sirve para actualizar los datos de un empleado
	 *@param {integer} id
	 *@param {integer} departamento
	 *@param {String} nombre
	*@param {String} apellidoP
	*@param {String} apellidoM
	*@param {date} fechaNacimiento
	*@param {String} correo
	*@param {String} genero
	*@param {String} telefono
	*@param {String} celular
	
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async update({
		id='',
		departamento='',
		nombre='',
		apellidoP='',
		apellidoM='',
		fechaNacimiento='',
		correo='',
		genero='',
		telefono='',
		celular='',
	}) {
		let state={status: true,err: false};
		const updateData={
			fk_departamento: departamento,
			nombre: nombre,
			apellidoP: apellidoP,
			apellidoM: apellidoM,
			fechaNacimiento: fechaNacimiento,
			correo: correo,
			genero: genero,
			telefono: telefono,
			celular: celular,
		};
		const condition={idcat_empleados: id};
		try {

			const exist=await this.CheckExist(nombre,
				apellidoP,
				apellidoM,
				fechaNacimiento,
				correo);
			if(exist.num>1) {
				state.status=false;
				state.err=exist.err;
				return state;
			}

			const existEmp=await this.CheckExistDpto(departamento);
			if(!existEmp.exist) {
				state.status=false;
				state.err='no existe el departamento';
				return state;
			}

			const {affectedRows}=await this.Mysql.update(this.Table,updateData,condition);
			if(affectedRows&&affectedRows>0) {
				return state;
			}
			state.status=false;
			state.err='No se pudo actualizar ';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al actualizar .';
			return state;
		}
	}
	/**
	 * delete Se encarga de eliminar una empleado.
	 * @param {integer} id Es el id del empleado.
	 * @return {object} Regresa un 
	 * {
	 * 		status:true | si todo salé bien,
	 * 		err:false | si no hubo algún error,
	 * }
	 */
	async delete(id) {
		let state={status: true,err: false};
		const condition={idcat_empleados: id};
		try {
			const {affectedRows}=await this.Mysql.delete(this.Table,condition);
			if(affectedRows&&affectedRows>0) {
				return state;
			}
			state.status=false;
			state.err='No se pudo eliminar ';
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al eliminar ';
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
			let empleados=await this.Mysql.free('call getCatEmpleados');
			state.data=empleados;
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer a los empleados';
			return state;
		}
	}
	/**
	 * get Se encargara de traer los datos del empleado que le pidamos.
	 * @param {integer} id Es el id de del empleado
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
			const [departamento]=await this.Mysql.free(`call getOneEmpleados (${id})`);
			state.data={...departamento};
			return state;
		} catch(err) {
			state.status=false;
			state.err='Hubo un error al traer el registro.';
			return state;
		}
	}
}
module.exports=Empresas;