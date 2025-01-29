import { Component, DebugElement} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { CustomFGapDirective } from './custom-f-gap.directive';

@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            style="display: flex; flex-direction:row;" 
            cFGap="10px"
            cFGap.s="5px"
            cFGap.xl="15px">

            <div id="A">A</div>
            <div id="B">B</div>
            <div id="C">C</div>
        </div>
    `,
    standalone: false
})
class TestGapComponent {}


describe('Test CustomFGapDirective', () => {

    let component:TestGapComponent;
    let fixture: ComponentFixture<TestGapComponent>;
    let directive:CustomFGapDirective;
    let divContenedor:DebugElement;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestGapComponent,
                CustomFGapDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestGapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divContenedor = fixture.debugElement.query(By.directive(CustomFGapDirective));
        directive =  divContenedor.injector.get(CustomFGapDirective)
        breakPointService = TestBed.inject(BreakPointService);
    });


    it('La directiva CustomFGapDirective se instancia', () => {
        expect(directive).toBeTruthy();
    });

    it('El div contenedor del componente contiene la directiva', () => {      

        expect(divContenedor).toBeTruthy();
    });


    it('El div contenedor del componente tiene el atributo css Gap', () => {      

        expect(divContenedor.nativeElement.style.gap).toBeTruthy();
    });

    it('Se recoge el valor general para resoluciones no configuradas especificamente', () => {     

        expect(directive.valorGapGeneral).toBe("10px");
    });

    it('No hay valor (en el mapa) Gap, para las resoluciones NO definidas especificamente', () => {     

        expect(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.XSAMLL)).toBeUndefined();
        expect(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.MEDIUM)).toBeUndefined();
        expect(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.LARGE)).toBeUndefined();
    });

    it('HAY valor (en el mapa) Gap, para las resoluciones DEFINIDAS especificamente', () => {   


        expect(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.SAMLL)).toBe("5px");
        expect(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.XLARGE)).toBe("15px");
        
    });

    it('En una resolucion no configurada, se usa el valor general', () => { 

        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();
        
        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.LARGE);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html
        expect(divContenedor.nativeElement.style.gap).toBe(directive.valorGapGeneral);
    });

    it('En una resolucion configurada, se muestra su valor', () => {     

        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();;
        
        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que se ha llamado al metodo reasignar clases con la nueva resolucion
        expect(spy1).toHaveBeenCalledWith(ResolucionesCustomFlex.XLARGE);

        //Comprobamos que ha cambiado el valor de la porpiedad CSS en el html
        expect(divContenedor.nativeElement.style.gap).toBe(directive.mapaGapResoluciones.get(ResolucionesCustomFlex.XLARGE));
    });

});
