import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { CustomFlexboxDirective } from './custom-flexbox.directive';



@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            customFlexbox="row"
            customFlexbox.s="column"
            customFlexbox.xs="column">

            <div id="A">A</div>
            <div id="B">B</div>
            <div id="C">C</div>
        </div>
    `
  })
class TestCustomFlexboxComponent {}


describe('Test CustomFlexboxDirective', () => {

    let component:TestCustomFlexboxComponent;
    let fixture: ComponentFixture<TestCustomFlexboxComponent>;
    let directive:CustomFlexboxDirective;
    let divContenedor:DebugElement;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestCustomFlexboxComponent,
                CustomFlexboxDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestCustomFlexboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divContenedor = fixture.debugElement.query(By.directive(CustomFlexboxDirective));
        directive =  divContenedor.injector.get(CustomFlexboxDirective)
        breakPointService = TestBed.inject(BreakPointService);
    });


    it('La directiva CustomFlexboxDirective se instancia', () => {
        expect(directive).toBeTruthy();
    });

    it('El div contenedor del componente tiene el atributo css Gap', () => {      

        expect(divContenedor.nativeElement.style.display).toBe('flex');
    });

    it('En una resolucion no configurada, se usa el valor general', () => { 

        //Resolucion servicio mock por defecto es M

        expect(divContenedor.nativeElement.style.flexDirection).toBe('row');

        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();
        

        //CAMBIAMOS A L

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        //El resultado es el esperado para L
        expect(divContenedor.nativeElement.style.flexDirection).toBe('row');


        //CAMBIAMOS A XL

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XLARGE);

        //El resultado es el esperado para L
        expect(divContenedor.nativeElement.style.flexDirection).toBe('row');
    });


    it('En las resoluciones XS y S se usara orientacion de column', () => { 

        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();
        

        //CAMBIAMOS A S

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.SAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.SAMLL);

        //El resultado es el esperado para L
        expect(divContenedor.nativeElement.style.flexDirection).toBe('column');


        //CAMBIAMOS A XS

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XSAMLL);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XSAMLL);

        //El resultado es el esperado para L
        expect(divContenedor.nativeElement.style.flexDirection).toBe('column');
    });
});
