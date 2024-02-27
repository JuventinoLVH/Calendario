'use client'
import {useCalendarioContext, MES, getTagDay ,T_DIA} from"./calendarioContext"
import NumericInput from "react-numeric-input";
import DatePicker from "react-datepicker";

export default function Home() {
  const { calendario, setDiaInicial, setDiasAMostrar, dia_inicio}  = useCalendarioContext();
  return (
    <main className="flex flex-col items-center justify-between p-4">

        <div className="flex flex-row">
                <label htmlFor="">Fecha de inicio :</label>
            <DatePicker selected={dia_inicio} onChange={(date) => setDiaInicial(date)} />

            <div className="flex flex-row basi-3/4">
                <label htmlFor=""> Dias mostrados: </label>
                <NumericInput
                   min={1}
                   onChange={(value) => setDiasAMostrar(value)}
                 />

            </div>

        </div>

        { 
            calendario.map( año =>{ return(
                <div className="w-full ">

                    <div className="flex justify-center bg-blue-400 ">
                       {año.año} 
                    </div>    

                    { año.meses.map( mes => {return(
                        <div className="m-2 p-2 flex-col justify-center bg-blue-200">
                            { MES[mes.mes] }


                            <div className="flex flex-wrap justify-around bg-blue-100">
                            { mes.dias.map( dia =>{ 
                                switch(getTagDay(dia)){
                                    case T_DIA.DIAS_FEREADOS:
                                        return(
                                         <div className="bg-orange-200 p-1 rounded-lg size-20 ">
                                             {dia.getDate()}
                                         </div>
                                        )
                                    case T_DIA.ENTRE_SEMANA:
                                        return(
                                         <div className="bg-green-300 p-1 rounded-lg size-20 ">
                                             {dia.getDate()}
                                         </div>
                                        )
                                    case T_DIA.FIN_DE_SEMANA:
                                        return(
                                         <div className="bg-yellow-200 p-1 rounded-lg size-20 ">
                                             {dia.getDate()}
                                         </div>
                                        )
                                }
                            })}

                            </div>

                        </div>
                    )})}


                </div>
                
            )}) 
        }
    </main>
  );
}
