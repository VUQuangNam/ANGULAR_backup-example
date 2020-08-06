import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

// Plugins
import { includes } from 'lodash';

// Modules
import { DesignConfig } from 'src/config';
import { Helpers } from 'src/common/utils';
import { MetricService, BodyNoteService, ModalService } from 'src/common/services';
import { ModalMetricHistoryComponent } from './components/metric-history/modal-metric-history.component';
import { ModalNoteHistoryComponent } from './components/note-history/modal-note-history.component';

@Component({
    selector: 'tab-customer-metric',
    templateUrl: './tab-metric.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        MetricService,
        BodyNoteService,
        DesignConfig
    ]
})

export class TabCustomerMetricComponent implements OnInit {
    customerId: string;
    bodyNotes: any = [];
    topMetrics: any = [];
    bottomMetrics: any = [];

    // design config
    noteConfig: any = [];
    metricConfig: any = [];

    constructor(
        private metricService: MetricService,
        private noteService: BodyNoteService,
        private modalService: ModalService,
        private designConfig: DesignConfig,
        private route: ActivatedRoute,
        private helpers: Helpers
    ) { }

    async ngOnInit() {
        try {
            // load default config
            this.customerId = this.route.snapshot.paramMap.get('id');
            this.noteConfig = this.designConfig.bodyNotes;
            this.metricConfig = this.designConfig.metrics;

            // load metrics from service
            const metrics = await this.metricService.list({ customer_id: this.customerId });
            this.topMetrics = this.metricConfig
                .filter(
                    x => !includes(x.categories, 'Q')
                )
                .map(x => {
                    return {
                        id: x.id,
                        key: x.key,
                        name: x.name,
                        genders: x.genders,
                        categories: x.categories,
                        values: metrics.data[x.id] || [],
                    };
                });
            this.bottomMetrics = this.metricConfig
                .filter(
                    x => includes(x.categories, 'Q')
                )
                .map(x => {
                    return {
                        id: x.id,
                        key: x.key,
                        name: x.name,
                        genders: x.genders,
                        categories: x.categories,
                        values: metrics.data[x.id] || [],
                    };
                });

            // load body notes
            const bodyNotes = await this.noteService.list({ customer_id: this.customerId });
            this.bodyNotes = this.noteConfig.map(x => {
                return {
                    id: x.id,
                    key: x.key,
                    name: x.name,
                    genders: x.genders,
                    categories: x.categories,
                    values: x.values.map(value => {
                        const checkedData = bodyNotes.data[x.id] || [];
                        return {
                            id: value.id,
                            name: value.name,
                            checked: includes(
                                checkedData.map(data => data.value),
                                value.id
                            )
                        };
                    }),
                };
            });
        } catch (ex) {
            throw Error(ex);
        } finally {
            this.helpers.closeLoading();
        }
    }

    /**
     * Show metric history
     * @param {*} string
     */
    onShowMetricHistory(metric: object) {
        const initialState = {
            metric: metric,
            customerId: this.customerId
        };
        this.modalService.open(
            ModalMetricHistoryComponent,
            { class: 'modal-lg', initialState }
        );
    }

    /**
     * Show note history
     * @param {*} string
     */
    onShowNoteHistory(bodyNote: object) {
        const initialState = {
            bodyNote: bodyNote,
            customerId: this.customerId
        };
        this.modalService.open(
            ModalNoteHistoryComponent,
            { class: 'modal-md', initialState }
        );
    }
}
