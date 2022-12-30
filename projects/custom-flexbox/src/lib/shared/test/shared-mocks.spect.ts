

/** Mock del BreakPointService  */

import { Subject } from "rxjs";
import { ResolucionesCustomFlex } from "../../constants/resoluciones.enum";

export class BreakPointServiceMock{
    
    cambioBreakPoint$: Subject<ResolucionesCustomFlex> = new Subject<ResolucionesCustomFlex>();

    get breakPointActual():ResolucionesCustomFlex{
        return this._breakPointActual;
    }

    private _breakPointActual:ResolucionesCustomFlex = ResolucionesCustomFlex.MEDIUM;


    simularNuevoBreakpoint(materialBreakpoint:ResolucionesCustomFlex){

        this.cambioBreakPoint$.next(materialBreakpoint);
    }
}