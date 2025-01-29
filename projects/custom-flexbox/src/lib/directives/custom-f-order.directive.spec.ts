import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { CustomFOrderDirective } from './custom-f-order.directive';


@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            style="display: flex; flex-direction:row;">

            <div id="A" cFOrder="1" cFOrder.xs="3">A</div>
            <div id="B" cFOrder=2 cFOrder.xs="1">B</div>
            <div id="C" cFOrder="3" cFOrder.xs=2>C</div>
        </div>
    `,
    standalone: false
})
class TestOrderComponent {}

describe('CustomFOrderDirective', () => {
    
    let component:TestOrderComponent;
    let fixture: ComponentFixture<TestOrderComponent>;
    let divA:DebugElement;
    let divB:DebugElement;
    let divC:DebugElement;
    let directivaDivA:CustomFOrderDirective;
    let directivaDivB:CustomFOrderDirective;
    let directivaDivC:CustomFOrderDirective;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestOrderComponent,
                CustomFOrderDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestOrderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divA = fixture.debugElement.query(By.css('#A'));
        directivaDivA = divA.injector.get(CustomFOrderDirective);
        divB = fixture.debugElement.query(By.css('#B'));
        directivaDivB = divB.injector.get(CustomFOrderDirective);
        divC = fixture.debugElement.query(By.css('#C'));
        directivaDivC = divC.injector.get(CustomFOrderDirective);
        breakPointService = TestBed.inject(BreakPointService);
    });


    it('Las directivas CustomFOrderDirective se instancian', () => {
        expect(directivaDivA).toBeTruthy();
        expect(directivaDivB).toBeTruthy();
        expect(directivaDivC).toBeTruthy();
    });

    it('En las resoluciones no especficamente configuradas (S,M,L,XL), se usa el valor general', () => { 


        //Por defecro en servicio M
        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B yC
        expect(divA.nativeElement.style.order).toBe(directivaDivA.valorOrdenGeneral?.toString());
        expect(divB.nativeElement.style.order).toBe(directivaDivB.valorOrdenGeneral?.toString());
        expect(divC.nativeElement.style.order).toBe(directivaDivC.valorOrdenGeneral?.toString());


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
        expect(divA.nativeElement.style.order).toBe(directivaDivA.valorOrdenGeneral?.toString());
        expect(divB.nativeElement.style.order).toBe(directivaDivB.valorOrdenGeneral?.toString());
        expect(divC.nativeElement.style.order).toBe(directivaDivC.valorOrdenGeneral?.toString());

        //CAMBIAMOS A RESOLUCION XL

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.order).toBe(directivaDivA.valorOrdenGeneral?.toString());
        expect(divB.nativeElement.style.order).toBe(directivaDivB.valorOrdenGeneral?.toString());
        expect(divC.nativeElement.style.order).toBe(directivaDivC.valorOrdenGeneral?.toString());

        //CAMBIAMOS A RESOLUCION S

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.SAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.SAMLL);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.order).toBe(directivaDivA.valorOrdenGeneral?.toString());
        expect(divB.nativeElement.style.order).toBe(directivaDivB.valorOrdenGeneral?.toString());
        expect(divC.nativeElement.style.order).toBe(directivaDivC.valorOrdenGeneral?.toString());
    });


    it('En las resolucion especficamente configurada (XS), se usa el valor configurado', () => { 

        //Espiamos metodo reAsignarClasesCss
        const spy = spyOn<any>(directivaDivA, 'reAsignarClasesCss').and.callThrough();

        //CAMBIAMOS A RESOLUCION XS

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XSAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy).toHaveBeenCalledWith(ResolucionesCustomFlex.XSAMLL);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html de A,B y C
        expect(divA.nativeElement.style.order).toBe(directivaDivA.mapaOrdenResoluciones.get(ResolucionesCustomFlex.XSAMLL)?.toString());
        expect(divB.nativeElement.style.order).toBe(directivaDivB.mapaOrdenResoluciones.get(ResolucionesCustomFlex.XSAMLL)?.toString());
        expect(divC.nativeElement.style.order).toBe(directivaDivC.mapaOrdenResoluciones.get(ResolucionesCustomFlex.XSAMLL)?.toString());
    });


});
