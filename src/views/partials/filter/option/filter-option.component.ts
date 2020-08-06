import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

// Service & Config
import { FilterModel, FilterInputTypes } from 'src/common/models/filter.module';
import { ServiceClient } from 'src/common/services';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-filter-layout',
    templateUrl: './filter-option.component.html',
    styleUrls: ['./filter-option.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DatePipe
    ]
})

export class FilterComponent implements OnInit {
    // condition
    @Input() uri?: string;
    @Input() filters?: FilterModel[] = [];

    // Data model
    model: any = {};
    inputTypes = FilterInputTypes;

    constructor(
        private serviceClient: ServiceClient,
        private datePipe: DatePipe,
        private router: Router
    ) { }

    ngOnInit() {
        this.filters.map(x => x.conditions.map(
            async condition => {
                if (condition.service) {
                    try {
                        const respone = await this.serviceClient.get(
                            condition.service.uri
                        );
                        condition.options = respone[condition.service.respone];
                        console.log(condition.options);
                    } catch (ex) {
                        condition.options = [] as any;
                    }
                }
            })
        );
    }

    /**
     * handle input change
     * @param {*} $envent
     */
    onChangeValue() {
        return this.handleParamChanged();
    }

    /**
     * handle date selected
     * @param {*} params
     * @param {*} type
     */
    onSelecteDateTime(params = [], type: string) {
        let dateNow = new Date();
        switch (type) {
            case 'today':
                this.model[params[0]] = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                this.model[params[1]] = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                break;
            case 'yesterday':
                dateNow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 1);
                this.model[params[0]] = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                this.model[params[1]] = this.datePipe.transform(dateNow, 'MM/dd/yyyy');
                break;
            case 'this_week': case 'last_week':
                dateNow = type === 'this_week'
                    ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
                    : new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate() - 7);

                this.model[params[0]] = this.datePipe.transform(
                    new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay())),
                    'MM/dd/yyyy'
                );
                this.model[params[1]] = this.datePipe.transform(
                    new Date(dateNow.setDate(dateNow.getDate() - dateNow.getDay() + 6)),
                    'MM/dd/yyyy'
                );
                break;
            case 'this_month': case 'last_month':
                dateNow = type === 'this_month'
                    ? new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate())
                    : new Date(dateNow.getFullYear(), dateNow.getMonth() - 1, dateNow.getDate());

                this.model[params[0]] = this.datePipe.transform(
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

                this.model[params[0]] = this.datePipe.transform(
                    new Date(dateNow.getFullYear(), dateNow.getMonth(), 1),
                    'MM/dd/yyyy'
                );
                this.model[params[1]] = this.datePipe.transform(
                    new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0),
                    'MM/dd/yyyy'
                );
                break;
            default: break;
        }

        // TODO:: Set checked input
        $(`input[name=${params[0]}_${params[1]}]`).prop('checked', true);
        $(`input[name=${params[1]}_${params[0]}]`).prop('checked', false);

        return this.handleParamChanged();
    }

    /**
     * handle date change
     * @param {*} dates
     * @param {*} params
     */
    onChangeDateTime(dates = [], params = []) {
        if (params.length || dates.length) {
            this.model[params[0]] = dates[0];
            this.model[params[1]] = dates[1];
        }
        // TODO:: Set checked input
        $(`input[name=${params[0]}_${params[1]}]`).prop('checked', false);
        $(`input[name=${params[1]}_${params[0]}]`).prop('checked', true);

        return this.handleParamChanged();
    }

    /**
     * handle checkbox change
     * @param {*} $event
     */
    onChangeCheckbox($event) {
        const name = $event.target.name;
        const value = $event.target.value;
        this.model[name] = this.model[name] || [];
        if ($event.target.checked) this.model[name].push(value);
        else this.model[name] = this.model[name].filter(x => x !== value);
        return this.handleParamChanged();
    }

    /**
     * handle radio change
     * @param {*} $envent
     */
    onChangeRadio($event) {
        const name = $event.target.name;
        const value = $event.target.value;
        this.model[name] = value;
        return this.handleParamChanged();
    }

    /**
     * Handle event param changed
     * @private
     */
    handleParamChanged = () => {
        return this.router.navigate(
            [this.uri],
            { queryParams: this.model }
        );
    }
}
