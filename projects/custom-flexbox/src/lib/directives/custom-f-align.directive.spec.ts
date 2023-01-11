import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { CustomFAlignDirective, TipoAlineacionPorOrientacion, TipoAlineacionPorPerpendicular } from './custom-f-align.directive';


@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            style="display: flex; flex-direction:row;" 
            cFAlign="center center"
            cFAlign.s="start stretch"
            cFAlign.xl="space-between end">

            <div id="A">A</div>
            <div id="B">B</div>
            <div id="C">C</div>
        </div>
    `
})
class TestAlignComponent {}

describe('Test CustomFAlignDirective', () => {

    let component:TestAlignComponent;
    let fixture: ComponentFixture<TestAlignComponent>;
    let directive:CustomFAlignDirective;
    let divContenedor:DebugElement;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestAlignComponent,
                CustomFAlignDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestAlignComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divContenedor = fixture.debugElement.query(By.directive(CustomFAlignDirective));
        directive =  divContenedor.injector.get(CustomFAlignDirective)
        breakPointService = TestBed.inject(BreakPointService);
    });

    it('La directiva CustomFAlignDirective se instancia', () => {
        expect(directive).toBeTruthy();
    });

    it('Los valores por defecto son los indicados en el selector sin abrv resolucion', () => {
        
        //Nota: resolucion de inicializacion es M

        expect(directive.alineacionPorOrientacionGeneral).toBe(TipoAlineacionPorOrientacion.CENTER);
        expect(directive.alineacionPorPerpendicularGeneral).toBe(TipoAlineacionPorPerpendicular.CENTER);
    });

    it('Con la resolucion S se establece la configuracion esperada', () => {
        
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.SAMLL);
        
        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.SAMLL);

        expect(directive.cacheAlineacionPorO).toBe(TipoAlineacionPorOrientacion.START);
        expect(directive.cacheOrientacionP).toBe(TipoAlineacionPorPerpendicular.STRETCH);


        expect(divContenedor.nativeElement.style.justifyContent).toBe("start");
        expect(divContenedor.nativeElement.style.alignItems).toBe("stretch");
    });

    it('Con la resolucion XL se establece la configuracion esperada', () => {
        
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);
        
        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XLARGE);

        expect(directive.cacheAlineacionPorO).toBe(TipoAlineacionPorOrientacion.SPACE_BETWEEN);
        expect(directive.cacheOrientacionP).toBe(TipoAlineacionPorPerpendicular.END);

        expect(divContenedor.nativeElement.style.justifyContent).toBe("space-between");
        expect(divContenedor.nativeElement.style.alignItems).toBe("flex-end");
    });


    it('Se aplican clases generales con resolucion L', () => {
        
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);
        
        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        expect(directive.cacheAlineacionPorO).toBe(TipoAlineacionPorOrientacion.CENTER);
        expect(directive.cacheOrientacionP).toBe(TipoAlineacionPorPerpendicular.CENTER);

        expect(divContenedor.nativeElement.style.justifyContent).toBe("center");
        expect(divContenedor.nativeElement.style.alignItems).toBe("center");
     
    });
});
