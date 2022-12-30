
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';

/**
 * Servicio para obtener la resolucion del dispositivo cliente.
 * Permite mantenerse actualizado ante cambios de resolucion.
 */
@Injectable({
    providedIn: 'root'
})
export class BreakPointService {
    

    /**
     * Mapa con la relacion entre 'BreakPoint' y `ResolucionesCustomFlex`.
     * 
     * La clave es el `Breakpoints` con la informacion de rango de resoluciones,
     * y el valor es el en valor string/Enum al que se corresponde la resolucion en
     * esta libreria.
     */
    readonly displayNameMap = new Map([
        [Breakpoints.XSmall, ResolucionesCustomFlex.XSAMLL],
        [Breakpoints.Small, ResolucionesCustomFlex.SAMLL],
        [Breakpoints.Medium, ResolucionesCustomFlex.MEDIUM],
        [Breakpoints.Large, ResolucionesCustomFlex.LARGE],
        [Breakpoints.XLarge, ResolucionesCustomFlex.XLARGE],
    ]);

    /**
     * Suscripcion a los cambios en la resolucion de cliente.
     */
    cambioBreakPoint$: Subject<ResolucionesCustomFlex> = new Subject<ResolucionesCustomFlex>();
    
    /**
     * Cache local de la resolucion actual del cliente.
     */
    private _breakPointActual:ResolucionesCustomFlex = ResolucionesCustomFlex.MEDIUM;

    /**
     * Getter de la resolucion actual del cliente.
     */
    get breakPointActual():ResolucionesCustomFlex{
        return this._breakPointActual;
    }

    /**
     * Constructor del BreakPointService.
     * 
     * @param breakpointObserver Api Material para @media-queries
     */
    constructor(private breakpointObserver: BreakpointObserver) {
     
        //Suscripcion al API
        breakpointObserver.observe([
                Breakpoints.XSmall,
                Breakpoints.Small,
                Breakpoints.Medium,
                Breakpoints.Large,
                Breakpoints.XLarge
            ]).subscribe(result => {
                
                /**
                 * Recorremos la respuesta sobre los Breakpoints 
                 * observados.
                 */
                for (const query of Object.keys(result.breakpoints)) {
                    if (result.breakpoints[query]) {
                        this._breakPointActual = this.displayNameMap.get(query) 
                            ?? ResolucionesCustomFlex.MEDIUM; //En caso de desconcida, M                   
                    }
                }

                //Emitimos cambio
                this.cambioBreakPoint$.next(this.breakPointActual);
            });
    }
    
}
