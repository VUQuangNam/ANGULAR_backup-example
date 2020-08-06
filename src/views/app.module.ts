import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Modules
import { ThemeModule } from './themes/theme.module';
import { AuthGuard } from 'src/common/guard/auth.guard';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        ThemeModule,
        AppRoutingModule
    ],
    providers: [
        AuthGuard
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule { }
