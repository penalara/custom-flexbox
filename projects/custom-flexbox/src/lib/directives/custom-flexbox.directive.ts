import { Directive, Input, OnInit } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';

/**
 * Enum tipo string con valores posibles de orientacion.
 */
enum TipoHorientacion{
    HORIZONTAL = "row",
    VERTICAL = "column"
}

/**
 * Directiva que aplica CustomFlexbos y ademas determina la orientacion.
 */
@Directive({
    selector: `
        [customFlexbox],
        [customFlexbox.xs],
        [customFlexbox.s],
        [customFlexbox.m],
        [customFlexbox.l],
        [customFlexbox.xl]
    `,
    standalone: false
})
export class CustomFlexboxDirective extends CustomFlexboxBase implements OnInit{

    /**
     * Etiqueta para aplicar la propiedad css flex-direction
     */
    static readonly ETIQUETA_DIRECTION:string = "flex-direction";

    /**
     * PARAMETRO ENTRADA.
     * Orientacion por defecto para el elemento.
     */
    @Input('customFlexbox') set direccionLayout(orientacion:string){
        this.establecerOrientacion(orientacion);
    }

    /**
     * PARAMETRO ENTRADA.
     * Orientacion para la resolucion XS
     */
    @Input('customFlexbox.xs') set direccionLayoutXs(orientacion:string){
        this.establecerOrientacion(orientacion,ResolucionesCustomFlex.XSAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Orientacion para la resolucion S
     */
    @Input('customFlexbox.s') set direccionLayoutS(orientacion:string){
        this.establecerOrientacion(orientacion,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Orientacion para la resolucion M
     */
    @Input('customFlexbox.m') set direccionLayoutM(orientacion:string){
        this.establecerOrientacion(orientacion,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Orientacion para la resolucion L
     */
    @Input('customFlexbox.l') set direccionLayoutL(orientacion:string){
        this.establecerOrientacion(orientacion,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Orientacion para la resolucion XL
     */
    @Input('customFlexbox.xl') set direccionLayoutXl(orientacion:string){
        this.establecerOrientacion(orientacion,ResolucionesCustomFlex.XLARGE);
    }

    /**
     * Orientacion establecida por defecto para todas las resoluciones.
     */
    orientacionPorDefecto:TipoHorientacion = TipoHorientacion.HORIZONTAL;

    /**
     * Orientacion aplicada actualmente.
     */
    cacheOrientacion:string|undefined;

    /**
     * Mapa con las orientaciones especificamente configuradas para cada
     * resolucion.
     */
    mapaOrientacionesResolucion:Map<ResolucionesCustomFlex,TipoHorientacion|undefined> =
        new Map<ResolucionesCustomFlex,TipoHorientacion|undefined>([
            [ResolucionesCustomFlex.XSAMLL,undefined],
            [ResolucionesCustomFlex.SAMLL,undefined],
            [ResolucionesCustomFlex.MEDIUM,undefined], 
            [ResolucionesCustomFlex.LARGE,undefined],
            [ResolucionesCustomFlex.XLARGE,undefined]
        ]);

    /**
     * Constructor de la directiva CustomFlexboxDirective
     */
    constructor() {
        super();
    }

    /**
     * @inheritdoc
     * 
     * - Añadimos la clase 'flex-container' para aplicar CSS FlexBox
     */
    override ngOnInit(): void {

        //Añadimos estilo con display: flex;
        this.renderer.setStyle(this.hostElement.nativeElement, 
            "display","flex");
        super.ngOnInit();
    }

    /**
     * Metodo que permite establecer la configuracion de orientacion de forma
     * general o para un resolucion en concreto.
     * 
     * @param orientacionInput Configuracion de orientacion.
     * @param tipoResolucion Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    private establecerOrientacion(orientacionInput:string,tipoResolucion?:ResolucionesCustomFlex){

        //Validamos
        if(!(orientacionInput == TipoHorientacion.HORIZONTAL ||
            TipoHorientacion.VERTICAL)){
            //Error por consola
            console.error("NO se indica direccion VALIDA por lo que se asume horizontal/row")
        }

        const orientacion:TipoHorientacion = orientacionInput as TipoHorientacion;

        //Si se ha concretado la orientacion para una resolucion en particular
        if(tipoResolucion){
            //Establecemos la orientacion para la resolucion especificada
            this.mapaOrientacionesResolucion.set(tipoResolucion,orientacion);

        } else { //No se ha especificado una resolucion en concreto
            //Establecemos valor por defecto
            this.orientacionPorDefecto = orientacion;
        }
    }

    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion: ResolucionesCustomFlex): void {
        this.reasignarClasesParaOrientacion(nuevaResolucion);
    }


    /**
     * Metodo que reconfigura en la etiqueta styles la orientaccion del FlexBox.
     * 
     * @param nuevaResolucion Identificativo del tipo de resolucion al que
     *  ha cambiado en el usuario segun los tipos de ResolucionesCustomFlex.
     */
    private reasignarClasesParaOrientacion(nuevaResolucion: ResolucionesCustomFlex) {        

        //Obtenemos orientacion nueva a aplicar
        const orientacioAaplicar:string = this.mapaOrientacionesResolucion.get(nuevaResolucion) ??
            this.orientacionPorDefecto;

        //Comprobamos si debemos cambiar la orientacion
        if(orientacioAaplicar !== this.cacheOrientacion){

            //Modificamos flex-direction
            if(orientacioAaplicar === TipoHorientacion.HORIZONTAL){
                this.renderer.removeClass(this.hostElement.nativeElement, 
                    CustomFlexboxDirective.ETIQUETA_DIRECTION);
                this.renderer.setStyle(this.hostElement.nativeElement, 
                    CustomFlexboxDirective.ETIQUETA_DIRECTION,
                    TipoHorientacion.HORIZONTAL.toString());                
            } else {
                this.renderer.removeClass(this.hostElement.nativeElement, 
                    CustomFlexboxDirective.ETIQUETA_DIRECTION);
                this.renderer.setStyle(this.hostElement.nativeElement, 
                    CustomFlexboxDirective.ETIQUETA_DIRECTION,
                    TipoHorientacion.VERTICAL.toString());   
                }

            //Actualizamos la cache de orientacion
            this.cacheOrientacion = orientacioAaplicar;

        }// ELSE. No hay que aplicar cambios, ni modificar cache
    }

}
