import { Directive, Input } from '@angular/core';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { CustomFlexboxBase } from './base-directive/custom-flexbox-base.directive';

/**
 * Directiva que permite definir de forma porcentual el espacio que deben
 * ocupar los elementos que estan contenidos en un contenedor con CustomFlexbox.
 */
@Directive({
    selector: `
        [cFflex],
        [cFflex.xs],
        [cFflex.s],
        [cFflex.m],
        [cFflex.l],
        [cFflex.xl]
    `
})
export class CustomFFlexDirective extends CustomFlexboxBase{

    static readonly FLEX_BASIS_STYLE:string = "flex-basis";

    static readonly FLEX_GROW_STYLE:string = "flex-grow";

    static readonly FLEX_GROW_VALUE:number = 1;

    /**
     * Expresion regular para validar input de porcentaje.
     */
    readonly ESTRUCTURA_VALIDACION_FLEX_BASIS:RegExp = new RegExp('[0-9]+%');

    /**
     * Etiqueta que indica en las configuraciones general, o por resolucion
     * que se debe aplicar 'flex-grow' para asegurarse que se aplica tamaño
     * en funcion de espacio disponible.
     */
    static readonly ETIQUETA_RELLENAR_ESPACIO_SOBRANTE:string = "R";


    /**
     * PARAMETRO ENTRADA.
     * Estilos por defecto para el elemento.
     */
    @Input('cFflex') set cFflex(valor:string|number){
        this.inicializarYvalidarFlexBasis(valor);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XS
     */
    @Input('cFflex.xs') set cFflexXs(valor:string|number){
        this.inicializarYvalidarFlexBasis(valor, ResolucionesCustomFlex.XSAMLL);
    }
    
    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion S
     */
    @Input('cFflex.s') set cFflexS(valor:string|number){
       this.inicializarYvalidarFlexBasis(valor,ResolucionesCustomFlex.SAMLL);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion m
     */
    @Input('cFflex.m') set cFflexM(valor:string|number){
       this.inicializarYvalidarFlexBasis(valor,ResolucionesCustomFlex.MEDIUM);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion L
     */
    @Input('cFflex.l') set cFflexL(valor:string|number){
       this.inicializarYvalidarFlexBasis(valor,ResolucionesCustomFlex.LARGE);
    }

    /**
     * PARAMETRO ENTRADA.
     * Configuracion de estilos para la resolucion XL
     */
    @Input('cFflex.xl') set cFflexXl(valor:string|number){
       this.inicializarYvalidarFlexBasis(valor,ResolucionesCustomFlex.XLARGE);
    }


    /**
     * Valor Flex-basis, o bien la etiqueta que indica aplicar flex-grow, que se
     * aplica de forma general para cualquier resolucion que no tiene su propia
     * configuracion establecida.
     */
    valorFlexBasisGeneral:string|undefined;


    /**
     * Mapa con las configuraciones de Flex-basis, o flex-grow para las distintas
     * resoluciones cliente.
     */
    mapaFlexBasisResoluciones:Map<ResolucionesCustomFlex,string|undefined> = new Map<ResolucionesCustomFlex,string|undefined>([
        [ResolucionesCustomFlex.XSAMLL,undefined],
        [ResolucionesCustomFlex.SAMLL,undefined],
        [ResolucionesCustomFlex.MEDIUM,undefined],
        [ResolucionesCustomFlex.LARGE,undefined],
        [ResolucionesCustomFlex.XLARGE,undefined]
    ]);

    
    /**
     * Cache que contiene la coinfiguracion, en porcentaje, del FlexBasis que se
     * esta aplicando actualmente, o bien la etiqueta que indica aplicar flex-grow.
     * 
     * Si no se esta aplicando ningun valor es `undefined`
     */
    cacheConfigFlexBasisAplicada:string|undefined;


    /**
     * Constructor de la CustomFFlexDirective.
     */
    constructor() {        
        super();
    }


    /** @inheritdoc */
    protected reAsignarClasesCss(nuevaResolucion: ResolucionesCustomFlex): void {
        
        //Obtenemos configuracion nueva a aplicar
        const configFlexBasisAaplicar:string|undefined =
            this.mapaFlexBasisResoluciones.get(nuevaResolucion)
                ?? this.valorFlexBasisGeneral;
      
        //Comprobamos si debemos cambiar el FlexBasis
        if(configFlexBasisAaplicar !== this.cacheConfigFlexBasisAplicada){

            //Eliminamos FlexBasis configurado previo (si hay)
            if(this.cacheConfigFlexBasisAplicada){

                //Comprobamos si es un valor para flex-basis
                if(this.cacheConfigFlexBasisAplicada 
                    !== CustomFFlexDirective.ETIQUETA_RELLENAR_ESPACIO_SOBRANTE){
                    //Aplicamosflex-basis
                    this.renderer.removeStyle(this.hostElement.nativeElement,
                        CustomFFlexDirective.FLEX_BASIS_STYLE);

                } else {//Se debe aplicar flex-grow para rellenar
                    this.renderer.removeStyle(this.hostElement.nativeElement,
                        CustomFFlexDirective.FLEX_GROW_STYLE);
                }

            }

            //Comprobamos si se añade configuracion para la resolucion
            if(configFlexBasisAaplicar){

                if(configFlexBasisAaplicar
                    !== CustomFFlexDirective.ETIQUETA_RELLENAR_ESPACIO_SOBRANTE){

                    //Añadimos nueva configuracion de FLEX-BASIS
                    this.renderer.setStyle(this.hostElement.nativeElement,
                        CustomFFlexDirective.FLEX_BASIS_STYLE,configFlexBasisAaplicar);
                } else {

                    this.renderer.setStyle(this.hostElement.nativeElement,
                        CustomFFlexDirective.FLEX_GROW_STYLE,
                        CustomFFlexDirective.FLEX_GROW_VALUE);
                }
            }

            //Actualizamos cache
            this.cacheConfigFlexBasisAplicada = configFlexBasisAaplicar;
        }

    }


    /**
     * Inicializa la configuracion de Flex-basis de forma general o
     * para una determinada resolucion.
     * 
     * @param valor Configuracion numerica de porcentaje para el flex.
     * @param resolucion Opcional. Nombre identificativo de la resolucion
     *      cliente para la que se quiere establecer preferencia.
     */
    private inicializarYvalidarFlexBasis(valor: string|number,
        tipoResolucion?:ResolucionesCustomFlex):void{

        //Declaramos variable para guardar el resultado
        let resultado:string|undefined;


        //Comporbamos si se ha informado un string, no puramente numerico
        if(typeof valor === 'string' && isNaN(valor as any)){

            //Comprobamos que cumple el patron            
            const expresionValida:boolean = 
                this.ESTRUCTURA_VALIDACION_FLEX_BASIS.test(valor as string);
                        //Si la expresion es valida, asignamos configuracion en %
            if(expresionValida){
                resultado = valor;
            } else {
                console.error("cFflex no cumple patron [0-9]+%");
            }

        } else if(valor === ""){
            resultado = CustomFFlexDirective.ETIQUETA_RELLENAR_ESPACIO_SOBRANTE;
        
        //Si es numero o cadena numerica
        } else if (typeof valor === 'number' || !isNaN(valor as any)){
            resultado = valor.toString() + '%';
       
        } else{
            console.error("cFflex solo acepta valor numerico o [0-9]+%");
        }

        //Si se obtuvo resultado
        if(resultado){

            //Si se ha indicado para una resolucion
            if(tipoResolucion){
                this.mapaFlexBasisResoluciones.set(tipoResolucion,
                    resultado)
            } else {
                this.valorFlexBasisGeneral = resultado;
            }

        }
    }

}
