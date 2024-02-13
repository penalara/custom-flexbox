import { Directive, Input } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';


/**
 * Interface para tipar la informacion sobre aplicacion de Clases Css
 */
interface AplicacionClase {
    clase:string;
    seAplica:boolean;
}

/**
 * Directiva que permite utilizar distintas clases segun la resolucion.
 * Funciona de forma similar a `ngClass`.
 */
@Directive({
    selector: `
        [cfClass],
        [cfClass.xs],
        [cfClass.s],
        [cfClass.m],
        [cfClass.l],
        [cfClass.xl]
    `
})
export class CustomFNgClassDirective extends CustomFlexboxBase {



    /**
     * PARAMETRO ENTRADA.
     * Estilos por defecto para el elemento.
     */
    @Input('cfClass') set cfClass(value:string|string[]|Set<string>|{[klass: string]:any}|null|undefined){
       
        //Incializamos mapa
        this.inicializarValoresMapa(value,this.mapaClasesPorDefecto);
        //Cache de clases por defecto (si no se contradice por resolucion)
        this.cacheClasesPorDefecto = Array.from(this.mapaClasesPorDefecto.keys());
    }


    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XS
     */
    @Input('cfClass.xs') set cfClassXs(value:string|string[]|Set<string>|{[klass: string]: any}|null|undefined){
        this.inicializarValoresMapa(value,this.mapaClasesXs);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion S
     */
    @Input('cfClass.s') set cfClassS(value: string|string[]|Set<string>|{[klass: string]: any}|null|undefined){
        this.inicializarValoresMapa(value,this.mapaClasesS);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion m
     */
    @Input('cfClass.m') set cfClassM(value: string|string[]|Set<string>|{[klass: string]: any}|null|undefined){
        this.inicializarValoresMapa(value,this.mapaClasesM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion L
     */
    @Input('cfClass.l') set cfClassL(value: string|string[]|Set<string>|{[klass: string]: any}|null|undefined){
        this.inicializarValoresMapa(value,this.mapaClasesL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XL
     */
    @Input('cfClass.xl') set cfClassXl(value: string|string[]|Set<string>|{[klass: string]: any}|null|undefined){
        this.inicializarValoresMapa(value,this.mapaClasesXl);
    }

    /**
     * Mapa con las clases indicadas por defecto en la directiva.
     */
    mapaClasesPorDefecto:Map<string,boolean> =  new Map<string,boolean>();

    /**
     * Cache con las clases por defecto. Son las claves del mapa `mapaClasesPorDefecto`,
     * de forma que no se tengan que obtener para cada operacion.
     */
    cacheClasesPorDefecto:string[] = [];

    /**
     * Mapa con las clases indicadas para la resolucion XS en la directiva.
     * 
     * La clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     * aplicarse o no.
     */
    mapaClasesXs:Map<string,boolean> =  new Map<string,boolean>();

    /**
     * Mapa con las clases indicadas para la resolucion S en la directiva.
     * 
     * La clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     * aplicarse o no.
     */
    mapaClasesS:Map<string,boolean> =  new Map<string,boolean>();

    /**
     * Mapa con las clases indicadas para la resolucion M en la directiva.
     * 
     * La clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     * aplicarse o no.
     */
    mapaClasesM:Map<string,boolean> =  new Map<string,boolean>();

    /**
     * Mapa con las clases indicadas para la resolucion L en la directiva.
     * 
     * La clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     * aplicarse o no.
     */
    mapaClasesL:Map<string,boolean> =  new Map<string,boolean>();

    /**
     * Mapa con las clases indicadas para la resolucion XL en la directiva.
     * 
     * La clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     * aplicarse o no.
     */
    mapaClasesXl:Map<string,boolean> =  new Map<string,boolean>();
    

    /**
     * Mapa con los mapas de clases configuraras para cada resolucion.
     * La clave es el nombre idetificativo de la resolucion, y el valor el mapa
     * que contiene la configuracion de sus clases configuradas.
     */
    readonly mapaPorResolucion:Map<ResolucionesCustomFlex,Map<string,boolean>> =
        new Map<ResolucionesCustomFlex,Map<string,boolean>>([
            [ResolucionesCustomFlex.XSAMLL,this.mapaClasesXs],
            [ResolucionesCustomFlex.SAMLL,this.mapaClasesS],
            [ResolucionesCustomFlex.MEDIUM,this.mapaClasesM], 
            [ResolucionesCustomFlex.LARGE,this.mapaClasesL],
            [ResolucionesCustomFlex.XLARGE,this.mapaClasesXl]
        ]);
    

    /**
     * Cache con las clases aplicadas actualmente en el elmento que contiene
     * la directiva.
     */
    cacheClasesAplicadas:string[] = [];


    /**
     * Constructor de la CustomFNgClassDirective
     */
    constructor() {

        super();
    }
    
    /**
     * Metodo que permite procesar el @Input que recibe la configuracion de clases para
     * una resolucion y guardarla en su mapa correspondiente.
     * 
     * @param value Valores indicados en el @Input
     * @param mapa Mapa que persiste la configuracion de clases para una resolucion. La
     *      clave es el nombre de la clase, y el valor un `boolean` que indica si debe
     *      aplicarse o no.
     */
    private inicializarValoresMapa(value:string|string[]|Set<string>|{[klass: string]:any}|null|undefined,
        mapa:Map<string,boolean>):void {
       
        if(value){
            //Lista con valores para construir mapa
            const listaParaMapa:AplicacionClase[] = this.procesarValorNgClass(value);

            //Recorremos y procesamos la lista
            listaParaMapa.forEach((duplaClase:AplicacionClase)=>{
                mapa.set(duplaClase.clase,duplaClase.seAplica);
            });


        }//ELSE. No hay que hacer nada
    }

    /**
     * Procesa las distintas formas en las que se puede recibir configuracion de clases
     * para una resolucion y lo procesa para obtener un tipo de dato uniforme que poder
     * procesar para completar los mapas por resolucion.
     * 
     * @param valor Valores indicados en el @Input
     * 
     * @returns Tipo `AplicacionClase` con valor:`string` y clave:`boolean`
     */
    private procesarValorNgClass(valor: string|string[]|Set<string>|{ [claseCss:string]: boolean; }):AplicacionClase[]{

        //Evaluamos el tipo de dato recibido
        if(typeof valor === 'string'){

            return [{ clase:valor,seAplica:true }];

        } else if (Array.isArray(valor) || valor instanceof Set){

            const listaAux:AplicacionClase[] = [];
            
            //Añdimos cada elemento de la lista marcado para aplicar
            valor.forEach(valorIndividual=>{
                listaAux.push({clase:valorIndividual,seAplica:true});
            });

            return listaAux;

        } else {
            
            const listaAux:AplicacionClase[] = [];

            Object.keys(valor).forEach(clave=>{

                if(valor[clave]){
                    listaAux.push({clase:clave,seAplica:true});
                } else {
                    listaAux.push({clase:clave,seAplica:false});
                }
            });

            return listaAux;
        }

    }

    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion:ResolucionesCustomFlex): void {

        //Obtenemos las clases CSS que deben aplicarse por la resolucion
        const mapaAplicacion:Map<string,boolean> = this.mapaPorResolucion.get(nuevaResolucion) ?? new Map();

        //Clases que se han configurado especificamente para la resolucion
        const clasesEnResolucion:string[] = Array.from(mapaAplicacion.keys());
        

        //Construimos una lista con todas las clases susceptibles de sufrir cambios
        const clasesAEvaluar:string[] =
            [... new Set([
                ...clasesEnResolucion, //Clases propiad definidas en la reoslucion
                ...this.cacheClasesAplicadas, //Clases aplicadas actualmente
                ...this.cacheClasesPorDefecto //Clases por defecto
            ])];

        //Lista vacia para ir almacenando las clases que Si estaran presentes en el elemento
        const nuevaListaCacheDeClasesAplicadas:string[] = [];

        //Recorremos las clases a evaluar (para estar presentes en el elemento)
        clasesAEvaluar.forEach(claseAEvaluar=>{

            let resultado:boolean;

            //Comprobamos si estan en el mapa especifico de la resolucion
            if(mapaAplicacion.has(claseAEvaluar)){

                resultado = mapaAplicacion.get(claseAEvaluar)!
            
            //Comprobamos si estan en el mapa de clases por defecto
            } else if( this.mapaClasesPorDefecto.has(claseAEvaluar)){

                resultado = this.mapaClasesPorDefecto.get(claseAEvaluar)!
            
            //Si no esta presente en ninguno de los dos mapas, debe eliminarse
            } else {
                resultado = false;
            }

            //Aplicamos resultado, si debe estar presente:
            if(resultado){
                //Añadimos la clase a la nueva cache de clases aplicadas al elemento
                nuevaListaCacheDeClasesAplicadas.push(claseAEvaluar);

                //Añadimos la clase (si ya estaba no generara duplicados)
                this.renderer.addClass(this.hostElement.nativeElement, claseAEvaluar);
                
            } else {
                //No debe estar presente y la eliminamos
                this.renderer.removeClass(this.hostElement.nativeElement, claseAEvaluar);
            }
        });

        //Actualizamos cache
        this.cacheClasesAplicadas = nuevaListaCacheDeClasesAplicadas;
    }

}
