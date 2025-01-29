import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { CustomFFlexDirective } from './custom-f-flex.directive';

@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            style="display: flex; flex-direction:row;">

            <div id="A" cFflex="30" cFflex.xs="10">A</div>
            <div id="B" cFflex=50 cFflex.xs="80%">B</div>
            <div id="C" cFflex="20" cFflex.xs>C</div>
        </div>
    `,
    standalone: false
})
class TestFlexComponent {}

describe('Test CustomFFlexDirective', () => {
    
    let component:TestFlexComponent;
    let fixture: ComponentFixture<TestFlexComponent>;
    let divA:DebugElement;
    let divB:DebugElement;
    let divC:DebugElement;
    let directivaDivA:CustomFFlexDirective;
    let directivaDivB:CustomFFlexDirective;
    let directivaDivC:CustomFFlexDirective;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestFlexComponent,
                CustomFFlexDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestFlexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divA = fixture.debugElement.query(By.css('#A'));
        directivaDivA = divA.injector.get(CustomFFlexDirective);
        divB = fixture.debugElement.query(By.css('#B'));
        directivaDivB = divB.injector.get(CustomFFlexDirective);
        divC = fixture.debugElement.query(By.css('#C'));
        directivaDivC = divC.injector.get(CustomFFlexDirective);
        breakPointService = TestBed.inject(BreakPointService);
    });


    it('Las directivas CustomFFlexDirective se instancian', () => {
        expect(directivaDivA).toBeTruthy();
        expect(directivaDivB).toBeTruthy();
        expect(directivaDivC).toBeTruthy();
    });

    it('En las resoluciones no especficamente configuradas (S,M,L,XL), se usa el valor general', () => { 

        /** Se testea ademas proveer como argumento valor numerico o cadena numerica */

        //Por defecro en servicio M
        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B yC
        expect(divA.nativeElement.style.flexBasis).toBe(directivaDivA.valorFlexBasisGeneral);
        expect(divB.nativeElement.style.flexBasis).toBe(directivaDivB.valorFlexBasisGeneral);
        expect(divC.nativeElement.style.flexBasis).toBe(directivaDivC.valorFlexBasisGeneral);

        //Espiamos metodos reAsignarClasesCss
        const spy1 = spyOn<any>(directivaDivA, 'reAsignarClasesCss').and.callThrough();
        const spy2 = spyOn<any>(directivaDivB, 'reAsignarClasesCss').and.callThrough();
        const spy3 = spyOn<any>(directivaDivC, 'reAsignarClasesCss').and.callThrough();
        

        //CAMBIAMOS A RESOLUCION L

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);
        expect(spy2).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);
        expect(spy3).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.flexBasis).toBe(directivaDivA.valorFlexBasisGeneral);
        expect(divB.nativeElement.style.flexBasis).toBe(directivaDivB.valorFlexBasisGeneral);
        expect(divC.nativeElement.style.flexBasis).toBe(directivaDivC.valorFlexBasisGeneral);

        //CAMBIAMOS A RESOLUCION XL

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.flexBasis).toBe(directivaDivA.valorFlexBasisGeneral);
        expect(divB.nativeElement.style.flexBasis).toBe(directivaDivB.valorFlexBasisGeneral);
        expect(divC.nativeElement.style.flexBasis).toBe(directivaDivC.valorFlexBasisGeneral);

        //CAMBIAMOS A RESOLUCION S

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.SAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.SAMLL);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.flexBasis).toBe(directivaDivA.valorFlexBasisGeneral);
        expect(divB.nativeElement.style.flexBasis).toBe(directivaDivB.valorFlexBasisGeneral);
        expect(divC.nativeElement.style.flexBasis).toBe(directivaDivC.valorFlexBasisGeneral);
       
    });

    
    it('En las resolucion especficamente configurada (XS), se usa el valor configurado', () => { 

        /** Se testea ademas que acepta porcentaje, o sin valor para el resto de pantalla */

        //Espiamos metodo reAsignarClasesCss
        const spy = spyOn<any>(directivaDivA, 'reAsignarClasesCss').and.callThrough();

        //CAMBIAMOS A RESOLUCION XS

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XSAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy).toHaveBeenCalledWith(ResolucionesCustomFlex.XSAMLL);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.flexBasis).toBe(directivaDivA.mapaFlexBasisResoluciones.get(ResolucionesCustomFlex.XSAMLL)?.toString());
        expect(divB.nativeElement.style.flexBasis).toBe(directivaDivB.mapaFlexBasisResoluciones.get(ResolucionesCustomFlex.XSAMLL)?.toString());
        expect(divC.nativeElement.style.flexGrow).toBe(CustomFFlexDirective.FLEX_GROW_VALUE.toString());
    });

});
