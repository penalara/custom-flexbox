import { Directive, ElementRef, inject, OnInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { ResolucionesCustomFlex } from "../../constants/resoluciones.enum";
import { BreakPointService } from "../../service/break-point.service";

/**
 * Clase Abstracta para implementar la funcionalidad comun del grupo de directivas
 * del Custom FlexBox.
 */
@Directive()
export abstract class CustomFlexboxBase implements OnInit,OnChanges{

    /**
     * Libreria de angular para modificar el DOM de forma segura.
     */
    protected renderer: Renderer2 = inject(Renderer2);
    
    /**
     * Libreria de angular para obtener referencia del
     * elemento DOM donde se utiliza la directiva.
     */
    protected hostElement: ElementRef = inject(ElementRef);

    /**
     * Resolucion actual del usuario en su dispositivo cliente.
     */
    protected resolucionActual:ResolucionesCustomFlex = ResolucionesCustomFlex.MEDIUM;

    /**
     * Inyectamos el servicio que notifica los cambios de resolucion del usuario.
     */
    protected breakPointService:BreakPointService = inject(BreakPointService);
    
    /**
     * Variable para controlar si estamos ejecutando por primera vez `true`, o no
     * `false`.
     * En la llamada a `ngOnInit()` se establecera a false, como se ejecuta despues
     * de los setters de los @Input y el ´ngOnChanges()´, podremos evaluar en este
     * ultimo si cuando se reciben cambios, es la 
     */
    esPrimeraEjecucion:boolean = true;
    
    /**
     * Constructor de la directiva base CustomFlexboxBase.
     */
    constructor(){}

    
    /**
     * Lifecycle ngOnChanges Event.
     * - 
     */
    ngOnChanges(changes: SimpleChanges): void {

        //Comprobamos si es la primera ejecucion
        if(!this.esPrimeraEjecucion){
            /**
             * Si no es la primera ejecucion debemos de reasignar
             * clases debido a que algun @Input ha cambiado.
             * La actualizacion de valores que pueda requerir el 
             * @Input se habra hecho generalmente por un set o en un
             * overrride de este metedo (+ llamada super)
             */
            this.reAsignarClasesCss(this.resolucionActual);
        }
    }

    /**
     * Lifecycle ngOnInit Event.
     * - Obtiene la resolucion inicial.
     * - Configura clases css inicialmente.
     * - Suscripcion a los cambios de resolucion de pantalla.
     */
    ngOnInit(): void {

        this.esPrimeraEjecucion= false;
        
        //Inicializacion orientacion
        this.resolucionActual =  this.breakPointService.breakPointActual;        
        this.reAsignarClasesCss(this.resolucionActual);

        //Nos suscribimos a los cambios de resolucion
        this.breakPointService.cambioBreakPoint$.subscribe(cambioResolucion=>{
              
            //Actualizamos la resolucion actual
            this.resolucionActual=cambioResolucion;
            this.reAsignarClasesCss(this.resolucionActual);
        });  
    }

    /**
     * Metodo que cambia la asignacion de clases Css si es necesario
     * al detectar/asignar una resolucion del cliente.
     *  
     * @param nuevaResolucion Identificativo del tipo de resolucion
     *      al que ha cambiado en el usuario segun los tipos de
     *      `ResolucionesCustomFlex`.
     */
    protected abstract reAsignarClasesCss(nuevaResolucion:ResolucionesCustomFlex):void;
    
}