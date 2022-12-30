import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreakPointServiceMock } from '../shared/test/shared-mocks.spect';
import { ResolucionesCustomFlex } from '../constants/resoluciones.enum';
import { BreakPointService } from '../service/break-point.service';
import { CustomFNgClassDirective } from './custom-f-ng-class.directive';

@Component({
    selector: 'my-test-component',
    template: `
        <div id="contenedor"
            [cfClass]='{"claseA":true, "claseB":false}'
            [cfClass.xs]='{"claseA":false, "claseB":true}'
            [cfClass.l]='{"claseB":true}'
            [cfClass.xl]='{"claseC":true}'>
            <div id="A">A</div>
            <div id="B">B</div>
            <div id="C">C</div>
        </div>
    `,
    styles: [`
        .claseA{
            background-color:red;
        }

        .claseB{
            text-align: center;
        }

        .claseC{
            color: blue;
        }
    `]
  })
class TestNgClassComponent {}

describe('Test CustomFNgClassDirective', () => {

    let component:TestNgClassComponent;
    let fixture: ComponentFixture<TestNgClassComponent>;
    let directive:CustomFNgClassDirective;
    let divContenedor:DebugElement;
    let breakPointService:BreakPointService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                TestNgClassComponent,
                CustomFNgClassDirective
            ],
            imports:[],
            providers:[
                { provide: BreakPointService, useClass: BreakPointServiceMock }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = fixture = TestBed.createComponent(TestNgClassComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        divContenedor = fixture.debugElement.query(By.directive(CustomFNgClassDirective));
        directive =  divContenedor.injector.get(CustomFNgClassDirective)
        breakPointService = TestBed.inject(BreakPointService);
    });

    it('La directiva CustomFNgClassDirective se instancia', () => {
        expect(directive).toBeTruthy();
    });

    it('Se aplica configuracion por defecto en resoluciones sin conf especifica', () => {
            //NOTA: El servicio se inicializa en M

        expect(divContenedor.nativeElement).toHaveClass("claseA");
        expect(divContenedor.nativeElement).not.toHaveClass("claseB");
        expect(divContenedor.nativeElement).not.toHaveClass("claseC");
    });


    it('Una resolucion L, tiene sus clases establecidas, las que hereda por defecto.', () => {
    
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XLARGE);

        expect(divContenedor.nativeElement).toHaveClass("claseA");
        expect(divContenedor.nativeElement).not.toHaveClass("claseB");
        expect(divContenedor.nativeElement).toHaveClass("claseC");
    });

    it('Una resolucion XS, tiene sus clases establecidas, reescribiendo el por defecto.', () => {
    
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.XSAMLL);

        expect(divContenedor.nativeElement).not.toHaveClass("claseA");
        expect(divContenedor.nativeElement).toHaveClass("claseB");
        expect(divContenedor.nativeElement).not.toHaveClass("claseC");
    });

    it('Una resolucion L, contradice la conf general en la clase esablecida', () => {
    
        //Espiamos metodo reAsignarClasesCss
        const spy1 = spyOn<any>(directive, 'reAsignarClasesCss').and.callThrough();

        //Emitimos desde el servicio un cambio de resolucion
        breakPointService.cambioBreakPoint$.next(ResolucionesCustomFlex.LARGE);

        expect(divContenedor.nativeElement).toHaveClass("claseA");
        expect(divContenedor.nativeElement).toHaveClass("claseB");
        expect(divContenedor.nativeElement).not.toHaveClass("claseC");
    });

});
