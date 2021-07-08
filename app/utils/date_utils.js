const moment = require('moment');

class Date_Utils{

    getDiaSemana(dia){
        let diaFecha = '';
        switch (dia.getUTCDay()) {
            case 0:
                diaFecha = "Domingo";
                break;
            case 1:
                diaFecha = "Lunes";
                break;
            case 2:
                diaFecha = "Martes";
                break;
            case 3:
                diaFecha = "Miercoles";
                break;
            case 4:
                diaFecha = "Jueves";
                break;
            case 5:
                diaFecha = "Viernes";
                break;
            case 6:
                diaFecha = "Sabado";
                break;
            default:
                break;
        }  
        
        return diaFecha;
    }

    getDias(request){
        let fechaI = moment(request.fecha_inicio);
        let fechaF = moment(request.fecha_fin);

        let dias = 0;
        while (fechaF.diff(fechaI, 'days') > 0){
            dias++;
            fechaI.add(1, 'days');
        }

        return dias++;
    }

}

module.exports = Date_Utils;