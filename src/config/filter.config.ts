import { FilterModel } from 'src/common/models/filter.module';

const INPUT_TYPES = {
    // INPUT GROUP
    INPUT_TEXT: 'text',
    INPUT_NUMBER: 'number',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',

    // Date Group
    DATE_TIME: 'date_time',
    DATE_RANGE: 'date_range',

    // SELECT GROUP
    SELECT: 'select',
    SELECT_SEARCH: 'select_search',
    SELECT_MULTIPLE: 'select_multiple',
};


export class FilterConfig {

    /**
     * Base config
     */
    baseConfig = {
        demo: [
            {
                active: true,
                title: 'Select multiple',
                conditions: [
                    {
                        key: 'select_multiple',
                        type: INPUT_TYPES.SELECT_MULTIPLE,
                        lable: 'Select multiple',
                        value: null,
                        checked: false,
                        options: null,
                        service: {
                            uri: '/v1/customer-group',
                            respone: 'data',
                        },
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: true,
                    modalRef: '#modal_create_group'
                }
            },
            {
                active: true,
                title: 'Select box',
                conditions: [
                    {
                        key: 'select',
                        type: INPUT_TYPES.SELECT_SEARCH,
                        lable: 'Select box',
                        value: null,
                        checked: false,
                        options: [
                            {
                                value: '1',
                                lable: 'gía trị 1'
                            },
                            {
                                value: '1',
                                lable: 'gía trị 2'
                            }
                        ],
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Input text',
                conditions: [
                    {
                        key: 'input_text',
                        type: INPUT_TYPES.INPUT_TEXT,
                        lable: 'Input text',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'input_number',
                        type: INPUT_TYPES.INPUT_NUMBER,
                        lable: 'Input number',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Checkbox',
                conditions: [
                    {
                        key: 'checkbox',
                        type: INPUT_TYPES.CHECKBOX,
                        lable: 'Giá trị 1',
                        value: '1',
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'checkbox',
                        type: INPUT_TYPES.CHECKBOX,
                        lable: 'Giá trị 2',
                        value: '2',
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Radio',
                conditions: [
                    {
                        key: 'radio',
                        type: INPUT_TYPES.RADIO,
                        lable: 'Gía trị 1',
                        value: '1',
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'radio',
                        type: INPUT_TYPES.RADIO,
                        lable: 'Gía trị 2',
                        value: '2',
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            },
            {
                active: true,
                title: 'Date time',
                conditions: [
                    {
                        key: ['date_time_min', 'date_time_max'],
                        type: INPUT_TYPES.DATE_TIME,
                        lable: 'date',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: ['time_range_min', 'time_range_max'],
                        type: INPUT_TYPES.DATE_RANGE,
                        lable: 'time range',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    }
                ],
                config: {
                    show: true,
                    info: false,
                    create: false,
                    modalRef: null
                }
            }
        ] as FilterModel[],
    };

    /**
     * Load filter config
     * @key {String} type
     * @public
     */
    public get configs(): FilterModel[] {
        return this.baseConfig.demo;
    }
}
