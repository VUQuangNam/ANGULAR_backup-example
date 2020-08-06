import { FilterModel, FilterInputTypes } from './filter.module';
import { Storage } from './storage.model';

export class CustomerGroup {
    id: string;
    name: string;
    note: string;
    members: number;
    store: {
        id: string;
        name: string;
        phone: string;
        address: string;
    };
    customers: [
        {
            id: string;
            name: string;
            phone: string;
            address: string;
        }
    ];
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: CustomerGroup) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.name) this.name = state.name;
            if (state.note) this.note = state.note;
            if (state.store) this.store = state.store;
            if (state.customers) this.customers = state.customers;
        }
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'name',
                name: 'Tên nhóm',
                width: 150,
                active: true,
                type: 'link',
                to: 'customer-group'
            },
            {
                id: 'members',
                name: 'Thành viên',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'note',
                name: 'Mô tả',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'store',
                name: 'Chi nhánh',
                width: 150,
                active: true,
                type: 'object',
                index: 'name'
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
        const stores = JSON.parse(
            localStorage.getItem(
                Storage.STORES
            )
        );
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
                title: 'Chi nhánh',
                conditions: [
                    {
                        key: 'stores',
                        type: FilterInputTypes.CHECKBOX,
                        lable: 'Chi nhánh',
                        value: null,
                        checked: false,
                        options: stores && stores.length
                            ? stores.map(el => {
                                return {
                                    id: el.id,
                                    name: el.name,
                                };
                            })
                            : [],
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
