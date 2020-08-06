import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Plugins
import { ToastrService } from 'ngx-toastr';

// Modules
import { ModalService, MetricService } from 'src/common/services';
import { Helpers } from 'src/common/utils';
import { ErrorModel } from 'src/common/models';

@Component({
    selector: 'modal-metric-history',
    templateUrl: './modal-metric-history.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        MetricService
    ]
})

export class ModalMetricHistoryComponent implements OnInit {
    // Variables
    model: any = {};
    metric: any = {};
    customerId: string;

    constructor(
        private modalService: ModalService,
        private metricService: MetricService,
        private toastrService: ToastrService,
        private helpers: Helpers,
        private router: Router
    ) { }

    ngOnInit() {
        console.log(this.metric);
    }

    /**
     * Create
     * @param {*} model
     */
    async onCreate() {
        this.helpers.openLoading();
        await this.metricService.create({
            key: this.metric.id,
            value: this.model.value,
            customer_id: this.customerId
        }).then(res => {
            if (res.code) {
                const error = new ErrorModel(res);
                this.toastrService.warning(error.getMessage);
                return false;
            }

            // Re-load data
            this.metric.values.push({
                key: this.metric.id,
                value: this.model.value,
                created_at: new Date(),
                created_by: {
                    id: 'admin',
                    name: 'admin'
                }
            });
            this.metric.values.sort((a, b) => {
                const contentA = new Date(a.created_at).getTime();
                const contentB = new Date(b.created_at).getTime();
                return contentB - contentA;
            });

            // Handle Success
            $('form').trigger('reset');
            this.toastrService.success('Thêm mới thành công!');
            return true;
        }).catch(ex => {
            throw Error(ex);
        }).finally(() => {
            this.helpers.closeLoading();
        });
    }

    /**
     * Close
     * @private
     */
    onClose() {
        this.modalService.close(
            ModalMetricHistoryComponent
        );
    }
}
