import { Component, ViewEncapsulation, OnInit, HostListener } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from 'src/common/utils';

@Component({
    selector: 'c-layout-base',
    templateUrl: './layout-1.component.html',
    encapsulation: ViewEncapsulation.None
})

export class LayoutComponent implements OnInit {
    constructor(
        private router: Router,
        private helper: Helpers
    ) { }

    @HostListener('window:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        switch (event.key) {
            case 'F1':
                this.router.navigate(['customers']);
                return false;
            case 'F2':
                this.router.navigate(['orders']);
                return false;
            case 'F3':
                this.router.navigate(['productions']);
                return false;
            case 'F4':
                this.router.navigate(['inventory/materials']);
                return false;
            default:
                break;
        }
    }

    ngOnInit() {
        this.router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                this.helper.openLoading();
            }
            if (route instanceof NavigationEnd) {
                console.log('end navigation');
            }
        });
    }
}
