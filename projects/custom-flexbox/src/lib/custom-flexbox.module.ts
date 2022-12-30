import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout'; 
import { CustomFlexboxDirective } from './directives/custom-flexbox.directive';
import { CustomFHideDirective } from './directives/custom-f-hide.directive';
import { CustomFNgClassDirective } from './directives/custom-f-ng-class.directive';
import { CustomFAlignDirective } from './directives/custom-f-align.directive';
import { CustomFGapDirective } from './directives/custom-f-gap.directive';
import { CustomFFlexDirective } from './directives/custom-f-flex.directive';
import { CustomFOrderDirective } from './directives/custom-f-order.directive';



@NgModule({
    declarations: [
        CustomFlexboxDirective,
        CustomFHideDirective,
        CustomFNgClassDirective,
        CustomFAlignDirective,
        CustomFGapDirective,
        CustomFFlexDirective,
        CustomFOrderDirective
    ],
    imports: [
        CommonModule,
        LayoutModule
    ],
    exports:[
        CustomFlexboxDirective,
        CustomFHideDirective,
        CustomFNgClassDirective,
        CustomFAlignDirective,
        CustomFGapDirective,
        CustomFFlexDirective,
        CustomFOrderDirective
    ]
})
export class CustomFlexBoxModule { }
