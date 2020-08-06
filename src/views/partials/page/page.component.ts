import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Plugins
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-page-layout',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class PaginationComponent implements OnInit {
    // Inputs
    @Input() path: string;

    // Variabale
    currentUrl: string;
    pageCurrent: number;
    pageLimit: number;
    params: any = {};
    next = 1;
    prev = 1;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) {
        // Load current url target
        this.currentUrl = this.router.url.split('?')[0];
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            const parmas = queryParams.params;
            this.pageLimit = !parmas.limit ? 20 : parseInt(parmas.limit, 0);
            this.pageCurrent = !parmas.page ? 1 : parseInt(parmas.page, 0);
            this.next = this.pageCurrent + 1;
            this.prev = this.pageCurrent - 1;
            this.params = queryParams.params;
        });
    }

    onChangePage(page: number) {
        if (!page) return;
        const params = cloneDeep(this.params);
        this.router.navigate(
            [this.currentUrl],
            {
                queryParams: Object.assign(
                    params,
                    { page }
                )
            }
        );
    }

    onChangeLimit(limit) {
        const params = cloneDeep(this.params);
        this.router.navigate(
            [this.currentUrl],
            {
                queryParams: Object.assign(
                    params,
                    { limit }
                )
            }
        );
    }
}
