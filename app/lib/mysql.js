const Mysql=require('../utils/request.mainMysql.js');
class MysqlLib {
    constructor() {
        /**
         * generateCondition Es un metodo privado el cual utiliza las
         * condiciones para generar el string.
         * @param {object} Conditions Son las condiciones que tendrá la petición.
         * {
         *      id:1
         * }
         */
        this.generateCondition=(Conditions={}) => {
            const KeysConditions=Object.keys(Conditions);
            let ConditionString="";
            let count=0;
            for(let Field of KeysConditions) {
                if(count>0) {
                    ConditionString+=` AND ${Field}='${Conditions[Field]}'`;
                } else {
                    ConditionString+=` WHERE ${Field}='${Conditions[Field]}'`;
                }
                count++;
            }
            return ConditionString
        }
        /**
         * Modificara los parametros especiales para
         * evitar ataques de inyección sql y ataques de tipo xss
         * @param {string} text Es el texto que evaluaremos. 
         */
        this.changeQuot=(text='') => {
            text=String(text);
            text=text.replace(/'/gi,"&#39;");
            text=text.replace(/"/gi,"&#34;");
            text=text.replace(/</gi,"&#60;");
            text=text.replace(/>/gi,"&#62;");
            return text;
        }
    }
    /**
     * La función insert nos ayudara a crear un registro nuevo en la tabla 
     * que le digamos de nuestra base de datos.
     * @param {string} Table Es la tabla en la cual se hará la inserción del dato
     * @param {array} Fields Son los campos a los cuales les agregaremos el registro
     * tienen que ir en el mismo orden que los valores de estos. 
     * [CampoUno,CampoDos]
     * @param {array} Values Son los valores que le agregaremos a los campos.
     * Tienen que ir en el mismo orden de los campos.
     * [ValorUno,ValorDos]
     */
    insert(Table='',Fields=[],Values=[]) {
        const fieldsTotString=Fields.toString();
        let valuesToString="";
        let numberOfValue=0;
        for(let value of Values) {
            if(value===null) {
                if(numberOfValue===0) {
                    valuesToString+=`${value}`;
                } else {
                    valuesToString+=`,${value}`;
                }
            } else {
                value=this.changeQuot(value);
                if(numberOfValue===0) {
                    valuesToString+=`'${value}'`;
                } else {
                    valuesToString+=`,'${value}'`;
                }
            }
            numberOfValue++;
        }
        const InsertQuery=`INSERT INTO ${Table} (${fieldsTotString}) VALUES (${valuesToString})`;
        // console.log(InsertQuery)
        return Mysql(InsertQuery);
    }
    /**
     * la función update  se encargara de actualizar un campo mediante los
     * datos y condiciones que nostros le pasemos en la tabla que le indiquemos
     * @param {string} Table Es la tabla donde actuará la actualización del dato 
     * @param {object} FieldsAndValues Son los campos y valores que actualizaremos
     * {
     *      Campo:'Valor'
     * }
     * @param {object} Condition Será la condición que tendremos para actualizar,
     * mediante su campo valor.
     * {
     *      Id:1
     * } 
     */
    update(Table='',FieldsAndValues={},Condition={}) {
        const KeysFieldsAndValues=Object.keys(FieldsAndValues);
        let StringKeysAndValues="";
        let count=0;
        for(let Field of KeysFieldsAndValues) {
            let value=this.changeQuot(FieldsAndValues[Field]);
            if(count>0) {
                StringKeysAndValues+=`,${Field}='${value}'`;
            } else {
                StringKeysAndValues+=`${Field}='${value}'`;
            }
            count++;
        }
        let ConditionString=this.generateCondition(Condition);
        const UpdateQuery=`UPDATE ${Table} SET ${StringKeysAndValues} ${ConditionString}`;
        return Mysql(UpdateQuery);
    }
    /**
     * La función delete se encargara de eliminar un registro en la tabla
     * que necesitemos mediante la condición que le indiquemos
     * @param {string} Table Será la tabla donde eliminaremos el registro.
     * @param {object} Condition Serán las condiciones que necesitamos para eliminar
     * el registro
     */
    delete(Table='',Condition={}) {
        const ConditionString=this.generateCondition(Condition);
        const DeleteQuery=`DELETE FROM ${Table} ${ConditionString}`;
        return Mysql(DeleteQuery);
    }
    /**
     * La función getAll se encargara de traernos todos los campos
     * de una tabla mediante las condiciones
     * @param {string} Table Es la tabla donde traeremos los datos
     * @param {object} Condition Es la condición que usaremos para traer
     * los datos, recordamos que si lo dejamos vacio, traera todo.
     */
    getAll(Table='',Condition={}) {
        const ConditionString=this.generateCondition(Condition);
        const SelectQuery=`SELECT * FROM ${Table} ${ConditionString}`;
        // console.log(SelectQuery)
        return Mysql(SelectQuery);
    }
    /**
     * La función get se encargara de traer ciertos campos y
     * ciertos valores mediantes sus condiciones
     * @param {string} Table Es la tabla de donde mandaremos a llamar los campos
     * @param {array} Fields Son los campos que necesitamos traer de la consulta.
     * @param {object} Condition Es la condición que usaremos para traer los
     * datos que necesitamos.
     */
    get(Table='',Fields=[],Condition={}) {
        const StringFields=Fields.toString();
        if(StringFields.length<=0) {
            StringFields="*";
        }
        const ConditionString=this.generateCondition(Condition);
        const SelectQuery=`SELECT ${StringFields} FROM ${Table} ${ConditionString}`;
        // console.log(SelectQuery)
        return Mysql(SelectQuery);
    }
    /**
     * La función free nos dará la libertad de hacer un query libre de así
     * necesitarlo.
     * @param {string} QUERY Es el query que usaremos para traer los datos
     * o hacer la función que se necesita. 
     */
    free(QUERY) {
        return Mysql(QUERY);
    }
    /**
     * changeSpecialCharacter se encarga de regresar los caracteres especiales como comillas
     * a su punto original.
     * @param {string} Value Es el valor que cambiaremos que proviene de la base de datos 
     */
    changeSpecialCharacter(Value='') {
        Value=String(Value);
        Value=Value.replace(/&#39;/gi,"'");
        Value=Value.replace(/&#34;/gi,'"');
        Value=Value.replace(/&#60;/gi,"<");
        Value=Value.replace(/&#62/gi,">");
        return Value;
    }
}
module.exports=MysqlLib;