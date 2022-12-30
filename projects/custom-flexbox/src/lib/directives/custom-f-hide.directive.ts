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
     * 
     */
    static readonly CLASE_CSSS_OCULTAR:string = "noMostrar"

    /**@Input's para configurar OCULTAR */

    /**
     * 
     */
    @Input('cfHide') set ocultarLayout(sinValor:any){
        this.establecerVisibilidad(false);
    }

    /**
     * 
     */
    @Input('cfHide.xs') set ocultarLayoutXs(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * 
     */
    @Input('cfHide.s') set ocultarLayoutS(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * 
     */
    @Input('cfHide.m') set ocultarLayoutM(sinValor:any){
        
        this.establecerVisibilidad(false,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * 
     */
    @Input('cfHide.l') set ocultarLayoutL(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.LARGE);
    }

    /**
     * 
     */
    @Input('cfHide.xl') set ocultarLayoutXl(sinValor:any){
        this.establecerVisibilidad(false,ResolucionesCustomFlex.XLARGE);
    }


    /**@Input's para configurar MOSTRAR */

    /**
     * 
     */
    @Input('cfShow') set mostrarLayout(sinValor:any){
        this.establecerVisibilidad(true);
    }

    /**
     * 
     */
    @Input('cfShow.xs') set mostrarLayoutXs(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * 
     */
    @Input('cfShow.s') set mostrarLayoutS(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * 
     */
    @Input('cfShow.m') set mostrarLayoutM(sinValor:any){
       
        this.establecerVisibilidad(true,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * 
     */
    @Input('cfShow.l') set mostrarLayoutL(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.LARGE);
    }

    /**
     * 
     */
    @Input('cfShow.xl') set mostrarLayoutXl(sinValor:any){
        this.establecerVisibilidad(true,ResolucionesCustomFlex.XLARGE);
    }
    


    /**
     * 
     */
    visibilidadPorDefecto:boolean = true;

    /**
     * 
     */
    cacheVisibilidad:boolean = true;


    /**
     * 
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
     * 
     * @param visibilidad 
     * @param tipoResolucion 
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

            //Si hay que aplicar `true` (visible SI)
            if(visibilidadAaplicar){
                this.renderer.removeClass(this.hostElement.nativeElement,
                    CustomFHideDirective.CLASE_CSSS_OCULTAR);
            } else { //Si hay que aplicar `true` (visible NO)
                this.renderer.addClass(this.hostElement.nativeElement,
                    CustomFHideDirective.CLASE_CSSS_OCULTAR);
            }

            //Actualizamos la cache
            this.cacheVisibilidad = visibilidadAaplicar;

        }// ELSE. No hay que aplicar cambios, ni modificar cache
    }

}
