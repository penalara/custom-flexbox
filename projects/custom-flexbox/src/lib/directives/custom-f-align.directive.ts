import { Directive,Input} from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';


/**
 * Enum con los tipos de Alineacion por ORIENTIACION.
 */
export enum TipoAlineacionPorOrientacion{
    NONE = "none",
    START = "start",
    CENTER = "center",
    END = "end",
    SPACE_AROUND = "space-around",
    SPACE_BETWEEN = "space-between",
    SPACE_EVENLY = "space-evenly"
}

/**
 * Enum con los tipos de Alineacion por PERPENDICULAR.
 */
export enum TipoAlineacionPorPerpendicular{
    NONE = "none",
    START = "start",
    CENTER = "center",
    END = "end",
    STRETCH = "stretch"
}


/**
 * Directiva que permite utilizar definir la alineacion por orientacion
 * y por perpendicular de los contenedores FlexBox.
 */
@Directive({
    selector: `
        [cFAlign],
        [cFAlign.xs],
        [cFAlign.s],
        [cFAlign.m],
        [cFAlign.l],
        [cFAlign.xl]
    `
})
export class CustomFAlignDirective extends CustomFlexboxBase{

    /**
     * Propiedad CSS a aplicar para alinear los elementos en el sentido del Flex
     */
    static readonly PROPIEDAD_CSS_ALINEACION_ORIENTACION_FLEX:string = "justify-content";

    /**
     * Propiedad CSS a aplicar para alinear los elementos en la otientacion
     * perpendicular a la orientacion del Flex.
     */
    static readonly PROPIEDAD_CSS_ALINEACION_PERPENDICULAR_FLEX:string = "align-items"


    readonly VALOR_ALINEACION_POR_ORIENTACION_FLEX_DEFAULT:TipoAlineacionPorOrientacion = TipoAlineacionPorOrientacion.START;

    readonly VALOR_ALINEACION_POR_PERPENDICULAR_DEFAULT:TipoAlineacionPorPerpendicular = TipoAlineacionPorPerpendicular.STRETCH;

    /**
     * MAPA con el valor CSS para la propiedad `justify-content`, utilizada
     * para la Alineacion segun la direccion/orientacion del FlexBox.
     */
    readonly MAPA_VALOR_JUSTIFY_CONTENT:Map<string,string|undefined> =
        new Map<string,string|undefined>([
            [TipoAlineacionPorOrientacion.NONE,undefined],
            [TipoAlineacionPorOrientacion.START,"start"],
            [TipoAlineacionPorOrientacion.CENTER,"center"],
            [TipoAlineacionPorOrientacion.END,"end"],
            [TipoAlineacionPorOrientacion.SPACE_AROUND,"space-around"],
            [TipoAlineacionPorOrientacion.SPACE_BETWEEN,"space-between"],
            [TipoAlineacionPorOrientacion.SPACE_EVENLY,"space-evenly"]
        ]);

    /**
     * MAPA con el valor CSS para la propiedad `alig-items`, utilizada
     * para  la Alineacion segun la PERPENDICULAR respecto de la direccion
     * del FlexBox.
     */
    readonly MAPA_VALOR_ALIGN_ITEMS:Map<string,string|undefined> =
        new Map<string,string|undefined>([
            [TipoAlineacionPorPerpendicular.NONE,undefined],
            [TipoAlineacionPorPerpendicular.START,"flex-start"],
            [TipoAlineacionPorPerpendicular.CENTER,"center"],
            [TipoAlineacionPorPerpendicular.END,"flex-end"],
            [TipoAlineacionPorPerpendicular.STRETCH,"stretch"]
        ]);

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion general.
     */
    @Input('cFAlign') set cFAlign(value:string){

        //Procesamos los terminos
        this.procesarAlineaciones(value);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion para resolucion XS.
     */
    @Input('cFAlign.xs') set cFAlignXs(value:string){
        //Procesamos los terminos
        this.procesarAlineaciones(value,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion para resolucion S.
     */
    @Input('cFAlign.s') set cFAlignS(value:string){
        //Procesamos los terminos
        this.procesarAlineaciones(value,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion para resolucion M.
     */
    @Input('cFAlign.m') set cFAlignM(value:string){
        //Procesamos los terminos
        this.procesarAlineaciones(value,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion para resolucion L.
     */
    @Input('cFAlign.l') set cFAlignL(value:string){
        //Procesamos los terminos
        this.procesarAlineaciones(value,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion alineacion para resolucion XL.
     */
    @Input('cFAlign.xl') set cFAlignXl(value:string){
        //Procesamos los terminos
        this.procesarAlineaciones(value,ResolucionesCustomFlex.XLARGE);
    }

    /**
     * Cache del valor utilizado actualmente para distribuir la alineacion
     * segun por la dieccion de orientacion del FlexBox.
     */
    cacheAlineacionPorO:TipoAlineacionPorOrientacion = TipoAlineacionPorOrientacion.NONE;


    /**
     * Cache del valor utilizado actualmente para distribuir la alineacion
     * por Perpendicular con direccion FlexBox.
     */
    cacheOrientacionP:TipoAlineacionPorPerpendicular = TipoAlineacionPorPerpendicular.NONE;

    /**
     * Valor especificado por @Input como por defecto en la alineacion
     * en la direccion de la orientacion del Flexbox para todas las 
     * resoluciones.
     * Solo se usa cuando la resolucion del cliente no tiene
     * establecida una configuracion determinada.
     */
    alineacionPorOrientacionGeneral:TipoAlineacionPorOrientacion = this.VALOR_ALINEACION_POR_ORIENTACION_FLEX_DEFAULT;

    /**
     * Mapa con la alineacion por direccion de Orientacion en el Flexbox
     * definida para cada resolucion.
     */
    mapaAlineacionPorOrientacionResolucion:Map<ResolucionesCustomFlex,TipoAlineacionPorOrientacion|undefined> =
        new Map<ResolucionesCustomFlex,TipoAlineacionPorOrientacion|undefined>([
            [ResolucionesCustomFlex.XSAMLL,undefined],
            [ResolucionesCustomFlex.SAMLL,undefined],
            [ResolucionesCustomFlex.MEDIUM,undefined], 
            [ResolucionesCustomFlex.LARGE,undefined],
            [ResolucionesCustomFlex.XLARGE,undefined]
        ]);


    /**
     * Valor especificado por @Input como por defecto para la alineacion
     * en la PERPENDICULAR a la direccion del FlexBox en todas las
     * resoluciones. 
     * Solo se usa cuando  la resolucion del cliente no tiene
     * establecida una configuracion determinada.
     */
    alineacionPorPerpendicularGeneral:TipoAlineacionPorPerpendicular = this.VALOR_ALINEACION_POR_PERPENDICULAR_DEFAULT;

    /**
     * Mapa con la alineacion, por direccion PERPENDICULAR respecto de la
     * direccion del Flexbox, definida para cada resolucion
     */
    mapaAlineacionPorPerpendicularResolucion:Map<ResolucionesCustomFlex,TipoAlineacionPorPerpendicular|undefined> =
        new Map<ResolucionesCustomFlex,TipoAlineacionPorPerpendicular|undefined>([
            [ResolucionesCustomFlex.XSAMLL,undefined],
            [ResolucionesCustomFlex.SAMLL,undefined],
            [ResolucionesCustomFlex.MEDIUM,undefined], 
            [ResolucionesCustomFlex.LARGE,undefined],
            [ResolucionesCustomFlex.XLARGE,undefined]
        ]);


    /**
     * Constructor de la CustomFAlignDirective
     */
    constructor() {
        super();
    }


    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion: ResolucionesCustomFlex): void {

        //Obtenemos alineaciones a aplicar
        const nuevaAlineacionO:TipoAlineacionPorOrientacion = this.mapaAlineacionPorOrientacionResolucion.get(nuevaResolucion)
            ?? this.alineacionPorOrientacionGeneral;
        const nuevaAlineacionP:TipoAlineacionPorPerpendicular = this.mapaAlineacionPorPerpendicularResolucion.get(nuevaResolucion)
            ?? this.alineacionPorPerpendicularGeneral;

        //Comprobamos si cambia la alineacion por ORIENTACION FLEX
        if(nuevaAlineacionO !== this.cacheAlineacionPorO){

            //Obtenemos el nuevo valor para la propiedad `justify-content`
            const nuevoValorPropiedadCss:string|undefined = 
                this.MAPA_VALOR_JUSTIFY_CONTENT.get(nuevaAlineacionO)

            //Si se debe añadir nuevo valor
            if(nuevoValorPropiedadCss){
                //Añadimos el nuevo valor para `justify-content`
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFAlignDirective.PROPIEDAD_CSS_ALINEACION_ORIENTACION_FLEX,
                    nuevoValorPropiedadCss);

            } else { // Se ha indicado que no se debe alinear
                //Eliminamos propiedad `justify-content`
                this.renderer.removeStyle(this.hostElement.nativeElement,
                    CustomFAlignDirective.PROPIEDAD_CSS_ALINEACION_ORIENTACION_FLEX);
            }

            //Actualizamos cache despues del cambio
            this.cacheAlineacionPorO = nuevaAlineacionO;

        }// ELSE. No cambio alineacion en direccion Flex

        //Si cambia la alineacion por PERPENDICULAR con direccion del flex
        if(nuevaAlineacionP !== this.cacheOrientacionP){

            //Obtenemos el nuevo valor para la propiedad `align-items`
            const nuevoValorPropiedadCssP:string|undefined = 
                this.MAPA_VALOR_ALIGN_ITEMS.get(nuevaAlineacionP);

            //Si se debe añadir nuevo valor
            if(nuevoValorPropiedadCssP){
                //Añadimos el nuevo valor para `align-items`
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFAlignDirective.PROPIEDAD_CSS_ALINEACION_PERPENDICULAR_FLEX,
                    nuevoValorPropiedadCssP);

            } else { // Se ha indicado que no se debe alinear en perpendicular a flex
                //Eliminamos propiedad `align-items`
                this.renderer.removeStyle(this.hostElement.nativeElement,
                    CustomFAlignDirective.PROPIEDAD_CSS_ALINEACION_PERPENDICULAR_FLEX);
            }

            //Actualizamos cache despues del cambio
            this.cacheOrientacionP = nuevaAlineacionP;

        }// ELSE. No cambio alienacion en orientacion PERPENDICULAR Flex

    }


    /**
     * Metodo que procesa la configuracion de alineacion recibida en un
     * @Input, ya sea general o para una resolucion.
     * 
     * @param value Lista de nombres identificativos de alineacion
     *      recibidos en un @Input, contenidos en una unica cadena
     *      separada por espacios.
     * @param resolucion Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    private procesarAlineaciones(value: string,resolucion?:ResolucionesCustomFlex):void{
        

        const terminos:string[] = value.split(" ");

        //Validamos que realmente se han indicado
        if(terminos && terminos.length >0){

            //Procesamos alineacion en direccion de Flexbox [Primer elemento]
            this.procesarAlineacionDireccionFlex(terminos[0],resolucion);

            //Procesamos alineacion en direccion PERPENDICULAR [Si hay segundo elemento]
            if(terminos[1]){
                this.procesarAlineacionPerpendicular(terminos[1],resolucion);
            }

        } else {//Advertencia a consola
            console.warn("No se han indicado alineaciones validas de Custom Flex");
        }
    }

    /**
     * Metodo que procesa una preferencia de alineacion HORIZONTAL.
     * 
     * @param termino Termino correspondiente en el @Input (primero)
     * @param resolucion Opcional. Indica si la preferencia es para
     *      una resolucion determinada.
     */
    private procesarAlineacionDireccionFlex(termino:string,
        resolucion?:ResolucionesCustomFlex):void{

        //Validamos que existe en el Enum
        if(termino 
            && Object.values(TipoAlineacionPorOrientacion).some(val => val === termino)){

            const valorAlineacionO:TipoAlineacionPorOrientacion =
                termino as TipoAlineacionPorOrientacion
            //Comprobamos si es el valor general, o especifico para resolucion
            if(resolucion){
                this.mapaAlineacionPorOrientacionResolucion.set(resolucion,
                    valorAlineacionO);
            } else {
                this.alineacionPorOrientacionGeneral = valorAlineacionO;
            }

        } else {//Advetencia
            console.warn("No se han indicado alineacion en direccion Flex valida.");
        }
    }

    /**
     * Metodo que procesa una preferencia de alineacion VERTICAL.
     * 
     * @param termino Termino correspondiente en el @Input (segundo)
     * @param resolucion Opcional. Indica si la preferencia es para
     *      una resolucion determinada.
     */
    private procesarAlineacionPerpendicular(termino:string,
        resolucion?:ResolucionesCustomFlex):void{

        //Validamos que existe en el Enum
        if(termino 
            && Object.values(TipoAlineacionPorPerpendicular).some(val => val === termino)){

            const valorAlineacionP:TipoAlineacionPorPerpendicular =
                termino as TipoAlineacionPorPerpendicular
            //Comprobamos si es el valor general, o especifico para resolucion
            if(resolucion){
                this.mapaAlineacionPorPerpendicularResolucion.set(resolucion,
                    valorAlineacionP);
            } else {
                this.alineacionPorPerpendicularGeneral = valorAlineacionP;
            }

        } else {//Advetencia
            console.warn("No se han indicado alineacion perpendicular valida.");
        }
    }

}
