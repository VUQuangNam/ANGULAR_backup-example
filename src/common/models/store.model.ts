import { FilterModel, FilterInputTypes } from './filter.module';

export class Store {
    id: string;
    name: string;
    logo: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Store) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.name) this.name = state.name;
            if (state.logo) this.logo = state.logo;
            if (state.phone) this.phone = state.phone;
            if (state.email) this.email = state.email;
            if (state.address) this.address = state.address;
            if (state.description) this.description = state.description;
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
                name: 'Mã điểm',
                width: 200,
                active: true,
                type: 'modal',
                to: 'setting/stores'
            },
            {
                id: 'name',
                name: 'Tên điểm',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'phone',
                name: 'Số điện thoại',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'email',
                name: 'Email',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'address',
                name: 'Địa chỉ',
                width: 200,
                active: true,
                type: 'text'
            },
            {
                id: 'created_by',
                name: 'Người tạo',
                width: 200,
                active: false,
                type: 'object',
                index: 'name'
            },
            {
                id: 'created_at',
                name: 'Ngày tạo',
                width: 200,
                active: false,
                type: 'text'
            },
            {
                id: 'updated_at',
                name: 'Cập nhật cuối',
                width: 200,
                active: false,
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
            }
        ] as FilterModel[];
    }
}
