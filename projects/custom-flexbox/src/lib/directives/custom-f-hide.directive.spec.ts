import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { CustomFHideDirective } from './custom-f-hide.directive';

@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            style="display: flex; flex-direction:row;">

            <div id="A">A</div>
            <div id="B" cfHide cfShow.l>B</div>
            <div id="C" cfHide.l>C</div>
            <div id="D" cfHide>D</div>
        </div>
    `,
    standalone: false
})
class TestHidepComponent {}


describe('Test CustomFHideDirective', () => {

    let component:TestHidepComponent;
    let fixture: ComponentFixture<TestHidepComponent>;
    let divB:DebugElement;
    let divC:DebugElement;
    let divD:DebugElement;
    let directivaDivB:CustomFHideDirective;
    let directivaDivC:CustomFHideDirective;
    let directivaDivD:CustomFHideDirective;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestHidepComponent,
                CustomFHideDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestHidepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divB = fixture.debugElement.query(By.css('#B'));
        directivaDivB = divB.injector.get(CustomFHideDirective);
        divC = fixture.debugElement.query(By.css('#C'));
        directivaDivC = divC.injector.get(CustomFHideDirective);
        divD = fixture.debugElement.query(By.css('#D'));
        directivaDivD = divD.injector.get(CustomFHideDirective);
        breakPointService = TestBed.inject(BreakPointService);
    });

    it('La directiva CustomFHideDirective se instancia en los elementos', () => {

        expect(directivaDivB).toBeTruthy();
        expect(directivaDivC).toBeTruthy();
        expect(directivaDivD).toBeTruthy();
    });

    it('Los elementos div contienen la clase', () => {

        expect(divB.nativeElement.style.display).toBeDefined();
        expect(divC.nativeElement.style.display).toBeDefined();
        expect(divD.nativeElement.style.display).toBeDefined();
    });

    it('Valor general esperado en los distintos div', () => {     

        /**
         * Tener en cuenta que puede haber valor `undefined`, si no se ha
         * configurado valor en las resoluciones.
         * Salvo modificacion (por defecto) la visibilidad general es `true`. 
         * Y cuando se especifica configuracion sera `true` o `false` en general
         * o en cada resolucion.
         */
        expect(directivaDivB.visibilidadPorDefecto).toBeFalse();
        expect(directivaDivC.visibilidadPorDefecto).not.toBeFalse();
        expect(directivaDivD.visibilidadPorDefecto).toBeFalse();
    });


    it('Valores esperados en resolucion con configuraciones especificadas', () => { 

        //Espiamos metodos reAsignarClasesCss
        const spy1 = spyOn<any>(directivaDivB, 'reAsignarClasesCss').and.callThrough();
        const spy2 = spyOn<any>(directivaDivC, 'reAsignarClasesCss').and.callThrough();
        const spy3 = spyOn<any>(directivaDivD, 'reAsignarClasesCss').and.callThrough();
        
        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);
        expect(spy2).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);
        expect(spy3).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        //Comprobamos si los div tiene o no la clase corrrespondiente segun
        expect(divB.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_MOSTRAR);
        expect(divC.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_OCULTAR);
        expect(divD.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_OCULTAR);
        
    });

    it('Valores esperados en resolucion con sin especificar (por defecto M)', () => { 

        //Espiamos metodos reAsignarClasesCss
        const spy1 = spyOn<any>(directivaDivB, 'reAsignarClasesCss').and.callThrough();
        const spy2 = spyOn<any>(directivaDivC, 'reAsignarClasesCss').and.callThrough();
        const spy3 = spyOn<any>(directivaDivD, 'reAsignarClasesCss').and.callThrough();
        
        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.MEDIUM);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.MEDIUM);
        expect(spy2).toHaveBeenCalledWith(ResolucionesCustomFlex.MEDIUM);
        expect(spy3).toHaveBeenCalledWith(ResolucionesCustomFlex.MEDIUM);
        //Comprobamos si los div tiene o no la clase corrrespondiente segun
        expect(divB.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_OCULTAR);
        expect(divC.nativeElement.style.display).toBeFalsy();
        expect(divD.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_OCULTAR);
        
    });


    it('Al cambiar la resolucion cambia la visibilidad si asi esta conf', () => { 

        //Espiamos metodos reAsignarClasesCss
        const spy1 = spyOn<any>(directivaDivB, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.MEDIUM);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.MEDIUM);

        //Comprobamos si los div tiene o no la clase corrrespondiente segun
        expect(divB.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_OCULTAR);

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);
        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        //Comprobamos si los div tiene o no la clase corrrespondiente segun
        expect(divB.nativeElement.style.display).toBe(CustomFHideDirective.VALOR_MOSTRAR);

    });


});
