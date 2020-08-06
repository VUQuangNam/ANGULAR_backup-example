import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-date-filter-layout',
    templateUrl: './date-filter.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        DatePipe
    ]
})

export class DateFilterComponent implements OnInit {
    // Declarations variable
    currentUrl: string;
    params: any = {};

    // Filters
    filters = [
        {
            name: 'Tất Cả',
            value: 'all',
            active: true,
        },
        {
            name: 'Hôm qua',
            value: 'yesterday',
            active: false,
        },
        {
            name: 'Hôm nay',
            value: 'today',
            active: false,
        },
        {
            name: 'Tuần này',
            value: 'this_week',
            active: false,
        },
        {
            name: 'Tuần trước',
            value: 'last_week',
            active: false,
        },
        {
            name: 'Tháng này',
            value: 'this_month',
            active: false,
        },
        {
            name: 'Tháng trước',
            value: 'last_month',
            active: false,
        }
    ];

    constructor(
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private router: Router,
    ) {
        this.currentUrl = this.router.url.split('?')[0];
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(async (queryParams: Params) => {
            this.params = queryParams.params;
        });
    }

    /**
     * Change filter
     * @param {*} type
     */
    onChange(type) {
        try {
            let dateNow = new Date();
            let start = null;
            let end = null;
            switch (type) {
                case 'today':
                    start = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                    end = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                    break;
                case 'yesterday':
                    dateNow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1);
                    start = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                    end = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                    break;
                case 'this_week': case 'last_week':
                    dateNow = type === 'this_week'
                        ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
                        : new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 7);

                    start = this.datePipe.transform(
                        new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay())),
                        'MM/dd/yyyy'
                    );
                    end = this.datePipe.transform(
                        new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay() + 6)),
                        'MM/dd/yyyy'
                    );
                    break;
                case 'this_month': case 'last_month':
                    dateNow = type === 'this_month'
                        ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
                        : new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, dateNow.getDate());

                    start = this.datePipe.transform(
                        new Date(dateNow.getFullYear(), dateNow.getMonth(), 1),
                        'MM/dd/yyyy'
                    );
                    this.datePipe.transform(
                        new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0),
                        'MM/dd/yyyy'
                    );
                    break;

                case 'this_year': case 'last_year':
                    dateNow = type === 'this_year'
                        ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
                        : new Date(dateNow.getFullYear() - 1, dateNow.getMonth(), dateNow.getDate());

                    start = this.datePipe.transform(
                        new Date(dateNow.getFullYear(), dateNow.getMonth(), 1),
                        'MM/dd/yyyy'
                    );
                    end = this.datePipe.transform(
                        new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0),
                        'MM/dd/yyyy'
                    );
                    break;
                default: break;
            }

            // navigate
            this.onNavigate(start, end);
        } catch (ex) {
            throw new Error(ex);
        }
    }

    /**
     * Select date
     * @param {*} date
     */
    onSelectDate(date) {
        const start = this.datePipe.transform(date[0], 'MM/dd/yyyy');
        const end = this.datePipe.transform(date[1], 'MM/dd/yyyy');
        this.onNavigate(start, end);
    }

    /**
     * Navigate
     * @param {*} start
     * @param {*} end
     */
    onNavigate(start: string, end: string) {
        const params = cloneDeep(this.params);
        return this.router.navigate(
            [this.currentUrl],
            {
                queryParams: Object.assign(
                    params,
                    {
                        end_time: end,
                        start_time: start
                    }
                )
            }
        );
    }
}
