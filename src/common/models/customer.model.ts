import { FilterModel, FilterInputTypes } from './filter.module';

export enum CustomerGenders {
    MALE = 'male',
    FEMALE = 'female'
}

export enum CustomerTypes {
    COMPANY = 'company',
    INDIVIDUAL = 'individual'
}

export enum CustomerStatuses {
    INACTIVE = 'inactive',
    ACTIVE = 'active',
    BANNED = 'banned'
}

export class Customer {
    // detail
    id: number;
    type: CustomerTypes;
    name: string;
    note: string;
    phone: string;
    email: string;
    avatar: string;
    cover: string;
    birthday: Date;
    gender: CustomerGenders;
    source: string;
    relation: string;
    friend: string;

    // access
    'rank_id': string;

    // company
    contact: string;
    'tax_code': string;

    // location
    country: string;
    'province_code': string;
    'district_code': string;
    address: string;

    // metrics
    'total_debt': number;
    'total_price': number;
    'total_point': number;
    'total_purchase': number;
    'last_purchase': Date;

    // additional
    groups: [
        {
            id: string;
            name: string
        }
    ];
    stores: [
        {
            id: string,
            name?: string,
            phone?: string,
            address?: string
        }
    ];

    // manager
    status: string;
    'created_at': string;
    'updated_at': Date;
    'created_by': Date;

    constructor(state?: any) {
        if (state) {
            if (state.type) this.type = state.type;
            if (state.name) this.name = state.name;
            if (state.note) this.note = state.note;
            if (state.phone) this.phone = state.phone;
            if (state.email) this.email = state.email;
            if (state.avatar) this.avatar = state.avatar;
            if (state.cover) this.cover = state.cover;
            if (state.birthday) this.birthday = state.birthday;
            if (state.gender) this.gender = state.gender;
            if (state.source) this.source = state.source;
            if (state.relation) this.relation = state.relation;
            if (state.friend) this.friend = state.friend;

            // access
            if (state.rank_id) this.rank_id = state.rank_id;

            // company
            if (state.contact) this.contact = state.contact;
            if (state.tax_code) this.tax_code = state.tax_code;

            // location
            if (state.country) this.country = state.country;
            if (state.province_code) this.province_code = state.province_code;
            if (state.district_code) this.district_code = state.district_code;
            if (state.address) this.address = state.address;

            // additional
            if (state.groups) this.groups = state.groups;
            if (state.stores) this.stores = state.stores;

            // manager
            if (state.status) this.status = state.status;
        }
    }

    /**
     * Get relationship
     * @public
     */
    public get relations() {
        return [
            { id: 'Mục Tiêu', name: 'Mục Tiêu' },
            { id: 'Tiềm Năng', name: 'Tiềm Năng' },
            { id: 'Đối Tác', name: 'Đối Tác' },
            { id: 'Biết Dunnio', name: 'Biết Dunnio' },
            { id: 'Thích Dunnio', name: 'Thích Dunnio' },
            { id: 'Chất Lượng', name: 'Chất Lượng' },
            { id: 'Chốt Cao', name: 'Chốt Cao' },
            { id: 'Mất Chốt', name: 'Mất Chốt' },
            { id: 'Thân Thiết', name: 'Thân Thiết' },
            { id: 'Trung Thành', name: 'Trung Thành' },
            { id: 'Chia Sẻ', name: 'Chia Sẻ' },
        ];
    }

    /**
     * Get Customer Sources
     */
    public get sources() {
        return [
            { id: 'Facebook', name: 'Facebook' },
            { id: 'Website', name: 'Website' },
            { id: 'Bạn Giới Thiệu', name: 'Bạn Giới Thiệu' },
            { id: 'Gần Cửa Hàng', name: 'Gần Cửa Hàng' },
            { id: 'Khách Cũ', name: 'Khách Cũ' },
            { id: 'Quà Tặng', name: 'Quà Tặng' }
        ];
    }

    /**
     * Get table collums
     * @public
     */
    public get collums(): Array<any> {
        return [
            {
                id: 'name',
                name: 'Tên khách hàng',
                width: 200,
                active: true,
                type: 'link',
                to: 'customers'
            },
            {
                id: 'phone',
                name: 'Điện thoại',
                width: 150,
                active: true,
                type: 'text'
            },
            {
                id: 'total_debt',
                name: 'Nợ hiện tại',
                width: 120,
                active: true,
                type: 'number'
            },
            {
                id: 'total_price',
                name: 'Tổng bán',
                width: 120,
                active: true,
                type: 'number'
            },
            {
                id: 'email',
                name: 'Email',
                width: 200,
                active: false,
                type: 'text'
            },
            {
                id: 'birthday',
                name: 'Ngày sinh',
                width: 200,
                active: false,
                type: 'text'
            },
            {
                id: 'gender',
                name: 'Giới tính',
                width: 120,
                active: false,
                type: 'text'
            },
            {
                id: 'status',
                name: 'Trạng thái',
                width: 120,
                active: false,
                type: 'text'
            },
            {
                id: 'address',
                name: 'Địa chỉ',
                width: 200,
                active: false,
                type: 'text'
            },
            {
                id: 'total_point',
                name: 'Tổng điểm',
                width: 120,
                active: false,
                type: 'number'
            },
            {
                id: 'total_purchase',
                name: 'Tổng giao dịch',
                width: 120,
                active: false,
                type: 'text'
            },
            {
                id: 'last_purchase',
                name: 'Giao dịch cuối',
                width: 200,
                active: false,
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
        const sources = this.sources;
        const relations = this.relations;

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
                title: 'Loại ngày',
                conditions: [
                    {
                        key: 'by_date',
                        type: FilterInputTypes.RADIO,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'created_at', name: 'Ngày tạo' },
                            { id: 'birthday', name: 'Sinh nhật' }
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
                title: 'Giới tính',
                conditions: [
                    {
                        key: 'genders',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: [
                            { id: 'male', name: 'Nam' },
                            { id: 'female', name: 'Nữ' }
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
                title: 'Mỗi quan hệ',
                conditions: [
                    {
                        key: 'relations',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: relations.map(el => {
                            return { id: el.id, name: el.name };
                        }),
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
                active: false,
                title: 'Nguồn khách hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: sources.map(el => {
                            return { id: el.id, name: el.name };
                        }),
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
                active: false,
                title: 'Rank khách hàng',
                conditions: [
                    {
                        key: 'sources',
                        type: FilterInputTypes.CHECKBOX,
                        lable: null,
                        value: null,
                        checked: false,
                        options: null,
                        service: {
                            uri: '/v1/ranks?skip=0&limit=50',
                            respone: 'data',
                        },
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
                active: false,
                title: 'Tổng tích lũy',
                conditions: [
                    {
                        key: 'min_total_point',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_total_point',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
                active: false,
                title: 'Chiều cao',
                conditions: [
                    {
                        key: 'min_height',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_height',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
                active: false,
                title: 'Cân nặng',
                conditions: [
                    {
                        key: 'min_weight',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_weight',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
                active: false,
                title: 'Số đo rộng vai',
                conditions: [
                    {
                        key: 'min_rong_vai',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_rong_vai',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
                active: false,
                title: 'Số đo bụng quần',
                conditions: [
                    {
                        key: 'min_vong_bung_quan',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_vong_bung_quan',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
                active: false,
                title: 'Số đo vòng cổ',
                conditions: [
                    {
                        key: 'min_vong_co',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Từ...',
                        value: null,
                        checked: false,
                        options: null,
                        service: null,
                        config: null
                    },
                    {
                        key: 'max_vong_co',
                        type: FilterInputTypes.INPUT_TEXT,
                        lable: 'Đến...',
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
