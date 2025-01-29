import { Directive, Input } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';

/**
 * Directiva que permite utilizar definir el espacio o GAP entre cajas
 * dentro de un contenedor CustomFlexbox.
 * 
 */
@Directive({
    selector: `
        [cFGap],
        [cFGap.xs],
        [cFGap.s],
        [cFGap.m],
        [cFGap.l],
        [cFGap.xl]
    `,
    standalone: false
})
export class CustomFGapDirective extends CustomFlexboxBase {

    static readonly GAP_STYLE:string = "gap";
    
    
    static readonly VALOR_GAP_POR_DEFECTO:string|undefined = undefined;


    readonly ESTRUCTURA_VALIDACION_DISTANCIA_GAP:RegExp = new RegExp('[0-9]+px');

    /**
     * PARAMETRO ENTRADA.
     * Estilos por defecto para el elemento.
     */
    @Input('cFGap') set cFGap(gapSetting:string){        
        this.inicializarYvalidarGap(gapSetting);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XS
     */
    @Input('cFGap.xs') set cFGapXs(gapSetting:string){
        this.inicializarYvalidarGap(gapSetting,
            ResolucionesCustomFlex.XSAMLL);
    }
    
    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion S
     */
    @Input('cFGap.s') set cFGapS(gapSetting:string){
        this.inicializarYvalidarGap(gapSetting,
            ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion m
     */
    @Input('cFGap.m') set cFGapM(gapSetting:string){
        this.inicializarYvalidarGap(gapSetting,
            ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion L
     */
    @Input('cFGap.l') set cFGapL(gapSetting:string){
        this.inicializarYvalidarGap(gapSetting,
            ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XL
     */
    @Input('cFGap.xl') set cFGapXl(gapSetting:string){
        this.inicializarYvalidarGap(gapSetting,
            ResolucionesCustomFlex.XLARGE);
    }


    /**
     * Valor general para cualquier resolucion que no tiene su propia
     * configuracion establecida.
     */
    valorGapGeneral:string|undefined = CustomFGapDirective.VALOR_GAP_POR_DEFECTO;

    /**
     * Mapa con las configuraciones de Gap para las distintas
     * resoluciones cliente.
     */
    mapaGapResoluciones:Map<ResolucionesCustomFlex,string|undefined> = new Map<ResolucionesCustomFlex,string|undefined>([
        [ResolucionesCustomFlex.XSAMLL,undefined],
        [ResolucionesCustomFlex.SAMLL,undefined],
        [ResolucionesCustomFlex.MEDIUM,undefined],
        [ResolucionesCustomFlex.LARGE,undefined],
        [ResolucionesCustomFlex.XLARGE,undefined]
    ]);

    /**
     * Cache que contiene el Gap, en formato `2px` que se esta aplicando actualmente.
     * Si no se esta aplicando ningun valor es `undefined`
     */
    cacheConfigGapAplicada:string|undefined;


    /**
     * Constructor de la CustomFGapDirective.
     */
    constructor() {                
        super();
    }

    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion: ResolucionesCustomFlex): void {

        //Obtenemos configuracion nueva a aplicar
        const configGapAaplicar:string|undefined =
            this.mapaGapResoluciones.get(nuevaResolucion)
                ?? this.valorGapGeneral;
            
        //Comprobamos si debemos cambiar el GAP
        if(configGapAaplicar !== this.cacheConfigGapAplicada){
            //Eliminamos GAP configurado previo (si hay)
            if(this.cacheConfigGapAplicada){
                this.renderer.removeStyle(this.hostElement.nativeElement,
                    CustomFGapDirective.GAP_STYLE);
            }

            //Comprobamos si se añade configuracion para la resolucion
            if(configGapAaplicar){
                //Añadimos nueva configuracion de gap
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFGapDirective.GAP_STYLE,configGapAaplicar);
            }

            //Actualizamos cache
            this.cacheConfigGapAplicada = configGapAaplicar;
        }
    }

    /**
     * Inicializa la configuracion de Gap de forma general o
     * para una determinada resolucion.
     * 
     * @param gapSetting Configuracion de pixeles para el Gap.
     * @param resolucion Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    private inicializarYvalidarGap(gapSetting:string,
        tipoResolucion?:ResolucionesCustomFlex):void{
        
        //Comporbamos si el gapSetting es correcto
        const expresionValida:boolean = 
            this.ESTRUCTURA_VALIDACION_DISTANCIA_GAP.test(gapSetting);

        //Si es valido
        if(expresionValida){

            //Si se ha indicado para una resolucion
            if(tipoResolucion){
                this.mapaGapResoluciones.set(tipoResolucion,gapSetting)
            } else {
                this.valorGapGeneral = gapSetting;
            }

        } else { //NO es valido. Error de consola y no hacemos nada
            console.error("cFGap con valor erroneo.")
        }
    }

}
