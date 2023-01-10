import { Directive, Input, OnInit } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';

/**
 * 
 */
@Directive({
    selector: `
        [cfHide],
        [cfHide.xs],
        [cfHide.s],
        [cfHide.m],
        [cfHide.l],
        [cfHide.xl],
        [cfShow],
        [cfShow.xs],
        [cfShow.s],
        [cfShow.m],
        [cfShow.l],
        [cfShow.xl]
    `
})
export class CustomFHideDirective extends CustomFlexboxBase implements OnInit{

    /**
     * Propiedad CSS a aplicar para mostrar/ocultar los elementos.
     */
    static readonly PROPIEDAD_CSSX:string = "display";

    /**
     * Valor para la propiedad CSS `display` para que se muestren los elementos
     * en flexbox de forma normal.
     */
    static readonly VALOR_MOSTRAR:string = "flex";

    /**
     * Valor para la propiedad CSS `display` para que se OCULTEN los elementos
     * contenidos en un flexbox.
     */
    static readonly VALOR_OCULTAR:string = "none"


    /**@Input's para configurar OCULTAR */

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de ocultacion general.
     */
    @Input('cfHide') set ocultarLayout(sinValor:any){
        this.establecerVisibilidad(false);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion ocultacion para resolucion XS.
     */
    @Input('cfHide.xs') set ocultarLayoutXs(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion ocultacion para resolucion S.
     */
    @Input('cfHide.s') set ocultarLayoutS(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion ocultacion para resolucion M.
     */
    @Input('cfHide.m') set ocultarLayoutM(sinValor:any){
        
        this.establecerVisibilidad(false,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion ocultacion para resolucion L.
     */
    @Input('cfHide.l') set ocultarLayoutL(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion ocultacion para resolucion XL.
     */
    @Input('cfHide.xl') set ocultarLayoutXl(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.XLARGE);
    }


    /**@Input's para configurar MOSTRAR */

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar general.
     */
    @Input('cfShow') set mostrarLayout(sinValor:any){
        this.establecerVisibilidad(true);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar en resolucion XS.
     */
    @Input('cfShow.xs') set mostrarLayoutXs(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar en resolucion S.
     */
    @Input('cfShow.s') set mostrarLayoutS(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar en resolucion M.
     */
    @Input('cfShow.m') set mostrarLayoutM(sinValor:any){
       
        this.establecerVisibilidad(true,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar en resolucion L.
     */
    @Input('cfShow.l') set mostrarLayoutL(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion para mostrar en resolucion XL.
     */
    @Input('cfShow.xl') set mostrarLayoutXl(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.XLARGE);
    }
    

    /**
     * Indica la preferencia por defecto cuando no se indicado valor.
     * Es `true` cuando el elemento se muestra, y `false` cuando no.
     */
    visibilidadPorDefecto:boolean = true;

    /**
     * Cache de la visibilidad aplicada en el momento.
     * Es `true` cuando el elemento se muestra, y `false` cuando no.
     */
    cacheVisibilidad:boolean = true;


    /**
     * Mapa con la configuracion de visibilidad por resoluciones.
     */
    mapaVisisibilidadPorResolucion:Map<ResolucionesCustomFlex,boolean|undefined> =
        new Map<ResolucionesCustomFlex,boolean|undefined>([
            [ResolucionesCustomFlex.XSAMLL,undefined],
            [ResolucionesCustomFlex.SAMLL,undefined],
            [ResolucionesCustomFlex.MEDIUM,undefined], 
            [ResolucionesCustomFlex.LARGE,undefined],
            [ResolucionesCustomFlex.XLARGE,undefined]
        ]);


    /**
     * Constructor de la directiva CustomFHideDirective
     */
    constructor() {
        super();            
    }

    /**
     * Metodo que permite configurar la visibilidad para una determinada
     * resolucion, o de forma general.
     * 
     * @param visibilidad Es `true` cuando el elemento debe mostrarse,
     *      y `false` cuando no.
     * @param tipoResolucion Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    establecerVisibilidad(visibilidad:boolean,
        tipoResolucion?:ResolucionesCustomFlex) {

        //Si se ha concretado la visibilidad para una resolucion en particular
        if(tipoResolucion){
            //Establecemos la orientacion para la resolucion especificada
            this.mapaVisisibilidadPorResolucion.set(tipoResolucion,visibilidad);
        
        } else{
            //No se ha especificado una resolucion en concreto
            //Establecemos valor por defecto
            this.visibilidadPorDefecto = visibilidad;
        }
    }


    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion:ResolucionesCustomFlex): void {           

        //Obtenemos la nueva visibilidad a aplicar
        const visibilidadEnMapa:boolean|undefined = this.mapaVisisibilidadPorResolucion.get(nuevaResolucion);
        
        let visibilidadAaplicar:boolean;

        if(visibilidadEnMapa !== undefined){
            visibilidadAaplicar = visibilidadEnMapa;
        } else {
            visibilidadAaplicar = this.visibilidadPorDefecto;
        }
        
        //Comprobamos si debemos cambiar la visibilidad
        if(visibilidadAaplicar !== this.cacheVisibilidad){

            //Se debe de mostrar el elemento
            if(visibilidadAaplicar){
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFHideDirective.PROPIEDAD_CSSX,
                    CustomFHideDirective.VALOR_MOSTRAR);
            } else { //hay que ocultar
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFHideDirective.PROPIEDAD_CSSX,
                    CustomFHideDirective.VALOR_OCULTAR);
            }

            //Actualizamos la cache
            this.cacheVisibilidad = visibilidadAaplicar;

        }// ELSE. No hay que aplicar cambios, ni modificar cache
    }

}
