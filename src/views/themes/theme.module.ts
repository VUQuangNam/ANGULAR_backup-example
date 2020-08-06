import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Core Module
import { LayoutComponent } from './layout-1/layout-1.component';
import { Layout2Component } from './layout-2/layout-2.component';
import { HeaderTopComponent } from './headers/header-top/header-top.component';
import { HeaderBottomComponent } from './headers/header-bottom/header-bottom.component';
import { HeaderMobileComponent } from './headers/header-mobile/header-mobile.component';
import { Helpers } from 'src/common/utils';

@NgModule({
    declarations: [
        LayoutComponent,
        Layout2Component,

        // headers
        HeaderTopComponent,
        HeaderBottomComponent,
        HeaderMobileComponent,
    ],
    exports: [
        LayoutComponent,
        Layout2Component,

        // headers
        HeaderTopComponent,
        HeaderBottomComponent,
        HeaderMobileComponent,
    ],
    providers: [
        // register service
        Helpers
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class ThemeModule {
}
