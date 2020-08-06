import { FilterModel, FilterInputTypes } from './filter.module';

export class Rank {
    id: string;
    name: string;
    note: string;
    discount: number;
    'min_price': number;
    customers: [string];
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Rank) {
        if (state) {
            this.id = state.id;
            this.name = state.name;
            this.note = state.note;
            this.discount = state.discount;
            this.min_price = state.min_price;
            this.customers = state.customers;
        }
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'id',
                name: 'Mã rank',
                width: 200,
                active: true,
                type: 'link',
                to: 'customer-rank'
            },
            {
                id: 'name',
                name: 'Tên rank',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'min_price',
                name: 'Điều kiện',
                width: 150,
                active: true,
                type: 'number'
            },
            {
                id: 'discount',
                name: 'Quyền lợi',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: true,
                type: 'object',
                index: 'name'
            },
            {
                id: 'created_at',
                name: 'Ngày tạo',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: true,
                type: 'text'
            }
        ];
    }

    /**
     * Get list filters
     * @public
     */
    public get filters(): Array<FilterModel> {
        return [
            {
                active: true,
                title: 'Tìm kiếm',
                conditions: [
                    {
                        key: 'keyword',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Tìm kiếm...',
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
                title: 'Quyền lợi rank',
                conditions: [
                    {
                        key: 'discount',
                        type: FilterInputTypes.INPUT_NUMBER,
                        lable: '',
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
        ] as FilterModel[];
    }
}
