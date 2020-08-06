import { FilterModel, FilterInputTypes } from './filter.module';

export class Staff {
    // detail
    id: string;
    name: string;
    note: string;
    phone: string;
    email: string;
    birthday: string;
    gender: string;
    status: string;
    'role_id': string;

    // additional
    stores: string;
    password: string;
    permissions: string;

    // location
    address: string;

    // manager
    'created_by': object;
    'created_at': Date;
    'updated_at': Date;

    constructor(state?: Staff) {
        if (state) {
            if (state.id) this.id = state.id;
            if (state.name) this.name = state.name;
            if (state.note) this.note = state.note;
            if (state.phone) this.phone = state.phone;
            if (state.email) this.email = state.email;
            if (state.birthday) this.birthday = state.birthday;
            if (state.gender) this.gender = state.gender;
            if (state.address) this.address = state.address;

            // access
            if (state.stores) this.stores = state.stores;
            if (state.role_id) this.role_id = state.role_id;
            if (state.password) this.password = state.password;
            if (state.permissions) this.permissions = state.permissions;
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
                name: 'Tên nhân viên',
                width: 200,
                active: true,
                type: 'link',
                to: 'setting/staffs'
            },
            {
                id: 'phone',
                name: 'Số điện thoại',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'role_id',
                name: 'Chức vụ',
                width: 150,
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
            }
        ] as FilterModel[];
    }
}
