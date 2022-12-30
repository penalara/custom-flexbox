import { Component } from '@angular/core';
import { BreakPointService } from 'custom-flexbox';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'demo-app';

    variableBol:boolean = true;

    constructor(private breakpointService:BreakPointService){}
    
    
    
    ngOnInit(): void {
        //this.breakpointService.cambioBreakPont$.subscribe(resultado=>console.log(resultado))
    }



    cambiarValorVariable():void{
        this.variableBol =  !this.variableBol;
    }
}
