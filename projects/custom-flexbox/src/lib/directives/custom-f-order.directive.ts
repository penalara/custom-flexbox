import { Directive, Input } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';

@Directive({
    selector: `
        [cFOrder],
        [cFOrder.xs],
        [cFOrder.s],
        [cFOrder.m],
        [cFOrder.l],
        [cFOrder.xl]
    `,
    standalone: false
})
export class CustomFOrderDirective extends CustomFlexboxBase {

    static readonly ORDER_STYLE:string = "order";

    /**
     * PARAMETRO ENTRADA.
     * Orden por defecto para el elemento.
     */
    @Input('cFOrder') set cFOrder(order:number|string){        
        this.inicializarYvalidarOrder(order);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de orden para la resolucion XS
     */
    @Input('cFOrder.xs') set cFOrderXs(order:number|string){
        this.inicializarYvalidarOrder(order,ResolucionesCustomFlex.XSAMLL);
    }
    
    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion S
     */
    @Input('cFOrder.s') set cFOrderS(order:number|string){
        this.inicializarYvalidarOrder(order,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion m
     */
    @Input('cFOrder.m') set cFOrderM(order:number|string){
        this.inicializarYvalidarOrder(order,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion L
     */
    @Input('cFOrder.l') set cFOrderL(order:number|string){
        this.inicializarYvalidarOrder(order,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XL
     */
    @Input('cFOrder.xl') set cFOrderXl(order:number|string){
        this.inicializarYvalidarOrder(order,ResolucionesCustomFlex.XLARGE);
    }

    /**
     * Valor general para cualquier resolucion que no tiene su propia
     * configuracion establecida, del orden que debe tener el elemento dentro del
     * contenedor CustomFlexbox.
     */
    valorOrdenGeneral:number|undefined;

    /**
     * Mapa con las configuraciones de orden para el elemento que contiene la
     * directiva dentro del contendedor CustomFlexBox.
     * 
     * Si el valor es `undefined` es porque el se usa la configuracion general
     * en esta configuracion.
     */
    mapaOrdenResoluciones:Map<ResolucionesCustomFlex,number|undefined> = new Map<ResolucionesCustomFlex,number|undefined>([
        [ResolucionesCustomFlex.XSAMLL,undefined],
        [ResolucionesCustomFlex.SAMLL,undefined],
        [ResolucionesCustomFlex.MEDIUM,undefined],
        [ResolucionesCustomFlex.LARGE,undefined],
        [ResolucionesCustomFlex.XLARGE,undefined]
    ]);

    /**
     * Cache que contiene el orden aplicado actualmente para el elemento que contiene la
     * directiva dentro del contendedor CustomFlexBox.
     */
    cacheOrdenAplicado:number|undefined;

    /**
     * Constructor de la CustomFOrderDirective.
     */
    constructor() {              
        super();
    }
    
    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion: ResolucionesCustomFlex): void {

        //Obtenemos el orden a aplicar
        const nuevoOrden:number|undefined = this.mapaOrdenResoluciones.get(nuevaResolucion)
            ?? this.valorOrdenGeneral;

        //Comprobamos si debemos cambiar el GAP
        if(nuevoOrden !== this.cacheOrdenAplicado){
            //Si habia orden previo lo retiramos
            if(this.cacheOrdenAplicado){
                this.renderer.removeStyle(this.hostElement.nativeElement,
                    CustomFOrderDirective.ORDER_STYLE);
            }

            //Si hay que establecer un nuevo orden, lo establecemos
            if(nuevoOrden){
                this.renderer.setStyle(this.hostElement.nativeElement,
                    CustomFOrderDirective.ORDER_STYLE,nuevoOrden);
            }

            //Actualizamos la cache
            this.cacheOrdenAplicado = nuevoOrden;
        }
    }


    /**
     * Inicializa la configuracion de Orden de elementos en el contendor
     * CustomFlexbox de forma general o para una determinada resolucion.
     * 
     * @param orden Configuracion de orden para el elemento que contiene la
     *      directiva dentro.
     * @param XSAMLL Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    private inicializarYvalidarOrder(orden:string|number,
        tipoResolucion?:ResolucionesCustomFlex) {

        //Comprobamos si se ha indicado realmente un valor numerico
        if(isNaN(orden as any)){
            console.error("No se ha indicado un valor numerico para Order de CustomFlexbox.")
        
        } else {//Se trata de un valor numerico

            let valor:number;

            //Aseguramos conversion a tipo number
            if(typeof orden === 'string'){
                valor = parseInt(orden);
            } else {
                valor = orden;
            }

            //Almacenamos en memoria el valor de orden segun resolucion
            if(tipoResolucion){
                this.mapaOrdenResoluciones.set(tipoResolucion,valor);
            } else {
                this.valorOrdenGeneral = valor;
            }

        }
            
    }
}
