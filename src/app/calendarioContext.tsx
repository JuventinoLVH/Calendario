'use client'
import { useContext,  createContext,useState } from "react";


//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~--
function newYear( fecha ){
    let y_template = {
        "año" : fecha.getFullYear(),
        "meses" : [{
            "mes" : fecha.getMonth(),
            "dias" : []
        }]
    };

    y_template.meses[0].dias.push( new Date(fecha.getTime() ) );
    return y_template
}

//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~--
function newMonth( fecha ){
    let m_template = {
        "mes" : fecha.getMonth(),
        "dias" : []
    };
    m_template.dias.push(new Date(fecha.getTime() ) );
    return m_template
}

//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~--
function calcularCalendario(inicial, dias){
    var fecha = new Date(inicial.getTime() ) ;
    var y_actual = newYear( fecha ) ;
    fecha.setDate( fecha.getDate() +1)


    var calendario = [];

    for (let i = 1; i < dias; i++) {
        if( fecha.getFullYear() != y_actual.año ){

            calendario.push(y_actual);
            y_actual = newYear( fecha) ;
        }
        else{

            if( fecha.getMonth() != y_actual.meses.at(-1).mes ){
                y_actual.meses.push( newMonth(fecha) );
            }
            else{

                y_actual.meses.at(-1).dias.push( new Date(fecha.getTime() ) );
            }
        }
        fecha.setDate( fecha.getDate() +1)
    }
    calendario.push(y_actual)

    return calendario;
}

//Formato : Día / Mes
const DIAS_FEREADOS = [ 
 "1/0",
 "5/1",
 "18/2",
 "1/4",
 "1/5",
 "16/8",
 "15/11"
];
// Enumeracion
const T_DIA = { 
 "FESTIVO" : 0 , 
 "FIN_DE_SEMANA" : 1 ,
 "ENTRE_SEMANA" : 2
};
const MES=[
"enero",
"febrero",
"marzo",
"abril",
"mayo",
"junio",
"julio",
"agosto",
"septiembre",
"octubre",
"noviembre",
"diciembre"
];
//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
function getTagDay( date ) {
    let day =  date.getDate() + '/' + date.getMonth() ;
    if( DIAS_FEREADOS.includes( day ) )
        return T_DIA.DIAS_FEREADOS;
    if( date.getDay() == 0 || date.getDay() == 6 )
        return T_DIA.FIN_DE_SEMANA;
        
    return T_DIA.ENTRE_SEMANA;
} 

//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~--
const initialState = {
    dia_inicio : new Date(Date.now()),
    dias_mostrados : 10,
};
initialState.calendario=calcularCalendario( 
    initialState.dia_inicio, 
    initialState.dias_mostrados
);
export { DIAS_FEREADOS,T_DIA, getTagDay, MES}

            

//-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~--
const CalendarioContext = createContext();
export const CalendarioProvider = ({ children }) => {


    const [state, setState] = useState( initialState);
    
    


    //-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
    function setDiasAMostrar( dias ) {
        let newCalendario = calcularCalendario( state.dia_inicio , dias);
        setState({
            ...state,
            dias_mostrados  : dias, 
            calendario  : newCalendario, 
        }) 
    }
    
    //-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~-~
    function setDiaInicial(  dia ) {
        console.log(dia)
        let newCalendario = calcularCalendario( dia , state.dias_mostrados);
        setState({
            ...state,
            dia_inicio  : dia, 
            calendario  : newCalendario, 
        }) 
    }

    

    //+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*+*
    return (
        <CalendarioContext.Provider value={{
                ...state,
                setDiasAMostrar,
                setDiaInicial
            }}
        >
            {children}
        </CalendarioContext.Provider>
    );
};

// Custom hook
export const useCalendarioContext = () => {
    return useContext(CalendarioContext);

};
