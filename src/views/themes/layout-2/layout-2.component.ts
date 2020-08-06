import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from 'src/common/utils';

@Component({
    selector: 'c-auth-layout',
    templateUrl: './layout-2.component.html',
    styleUrls: ['style.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class Layout2Component implements OnInit {

    constructor(
        private router: Router,
        private helper: Helpers
    ) { }

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
