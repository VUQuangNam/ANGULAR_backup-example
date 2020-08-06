import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

// Plugins
import { includes, isEqual } from 'lodash';

// Modules
import { DesignService } from 'src/common/services';

@Component({
    selector: 'app-design-style',
    templateUrl: './design-style.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        DesignService
    ]
})

export class DesignStyleComponent implements OnChanges {
    // Input Config
    @Input() genderId: string;
    @Input() categoryId: string;
    @Input() styleClass: string;
    @Input() extraClass: string;
    @Input() showUpdate: boolean;
    @Input() showInitialText: boolean;

    // Input Callback
    @Output() callback = new EventEmitter<any>();

    // Input model
    @Input() styleModel: any = {};
    @Input() extraModel: any = {};

    // Variables
    designConfig: any = {};
    designStyles: any = [];
    designExtras: any = [];

    constructor(
        private designService: DesignService,
    ) { }

    async ngOnChanges() {
        // load design config
        let respone = await this.designService.listStyles();
        this.designConfig.styles = respone.designs || [];
        respone = await this.designService.listExtras();
        this.designConfig.extras = respone.extras || [];

        // re-load design config
        this.handleDesignChange();
    }

    /**
     * Change Design
     * @param {*} designId
     * @param {*} valueId
     */
    onChangeDesign(designId: string, valueId: string) {
        this.designStyles.map(x =>
            x.id === designId &&
            x.values.map(v =>
                v.selected = isEqual(v.id, valueId)
            )
        );

        // reload design
        this.handleDesignChange();
    }

    /**
     * Change Extra
     * @param {*} extraId
     * @param {*} valueId
     * @param {*} subValueId
     */
    onChangeExtra(extraId: string, valueId: string, subValueId?: string) {
        this.designExtras.map(x =>
            x.id === extraId &&
            x.values.map(v => {
                v.selected = isEqual(v.id, valueId);
                if (v.values.length) {
                    if (!subValueId) {
                        v.values[0].selected = true;
                    } else {
                        v.values.map(sub =>
                            sub.selected = isEqual(sub.id, subValueId)
                        );
                    }
                }
            })
        );

        console.log(this.designExtras);
    }

    /**
     * Change Initial Text
     * @param {*} $event
     */
    onChangeInitialText = ($event: any) => {
        const extraId = $event.target.name;
        this.designExtras.filter(x =>
            x.id === extraId &&
            x.values.filter(v =>
                v.selected === true &&
                v.values.filter(sub =>
                    sub.text = sub.selected ? $event.target.value : null
                )
            )
        );
    }

    /**
     * Handle Design Change
     * @private
     */
    handleDesignChange() {
        try {
            // Declaration variable
            const dataHides = [];

            // Load data hide
            this.designStyles.map(x => {
                x.values.map(v => {
                    if (v.selected) {
                        v.hides.map(value => dataHides.push(value));
                    }
                });
            });

            // transform design & extra
            this.designStyles = this.designConfig.styles.filter(x =>
                includes(x.categories, this.categoryId) &&
                includes(x.genders, this.genderId) &&
                !includes(dataHides, x.id)
            ).map(data => {
                return {
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    genders: data.genders,
                    categories: data.categories,
                    selected: data.selected || false,
                    values: data.values.filter(
                        v => !includes(dataHides, v.id)
                    )
                };
            });
            this.designExtras = this.designConfig.extras.filter(x =>
                includes(x.categories, this.categoryId) &&
                includes(x.genders, this.genderId) &&
                !includes(dataHides, x.id)
            ).map(data => {
                if (!data.values.find(x => x.selected)) {
                    data.values[0].selected = true;
                }
                return {
                    id: data.id,
                    name: data.name,
                    icon: data.icon,
                    genders: data.genders,
                    categories: data.categories,
                    selected: data.selected || false,
                    values: data.values.filter(
                        v => !includes(dataHides, v.id)
                    )
                };
            });

            // sort data
            this.designStyles.sort(() => -1);
            this.designExtras.sort(() => -1);
        } catch (ex) {
            throw Error(ex);
        }
    }
}
