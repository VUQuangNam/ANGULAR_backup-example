export class Permission {
    id: string;
    name: string;
    checked: boolean;
    actived: boolean;
    menus: [
        {
            id: string;
            name: string;
            permissions: [
                {
                    id: string;
                    name: string;
                    checked: boolean
                }
            ]
        }
    ];


    /**
     * Get list permissions
     * @public
     */
    public get getPermissions(): Array<any> {
        return [
            {
                id: 'partners',
                name: 'Khách hàng',
                checked: false,
                actived: true,
                menus: [
                    {
                        id: 'CUSTOMER',
                        name: 'Quản lý khách hàng',
                        permissions: [
                            { id: 'CUSTOMER_LIST', name: 'Truy cập', checked: false },
                            { id: 'CUSTOMER_CREATE', name: 'Tạo mới', checked: false },
                            { id: 'CUSTOMER_UPDATE', name: 'Cập nhật', checked: false },
                            { id: 'CUSTOMER_DELETE', name: 'Xóa', checked: false },
                            { id: 'CUSTOMER_IMPORT', name: 'Nhập file', checked: false },
                            { id: 'CUSTOMER_EXPORT', name: 'Xuất file', checked: false }
                        ]
                    },
                    {
                        id: 'RANK',
                        name: 'Quản lý rank',
                        permissions: [
                            { id: 'RANK_LIST', name: 'Truy cập', checked: false },
                            { id: 'RANK_CREATE', name: 'Tạo mới', checked: false },
                            { id: 'RANK_UPDATE', name: 'Cập nhật', checked: false },
                            { id: 'RANK_DELETE', name: 'Xóa', checked: false },
                            { id: 'RANK_IMPORT', name: 'Nhập file', checked: false },
                            { id: 'RANK_EXPORT', name: 'Xuất file', checked: false }
                        ]
                    },
                    {
                        id: 'CUSTOMER_GROUP',
                        name: 'Quản nhóm khách hàng',
                        permissions: [
                            { id: 'CUSTOMER_GROUP_LIST', name: 'Truy cập', checked: false },
                            { id: 'CUSTOMER_GROUP_CREATE', name: 'Tạo mới', checked: false },
                            { id: 'CUSTOMER_GROUP_UPDATE', name: 'Cập nhật', checked: false },
                            { id: 'CUSTOMER_GROUP_DELETE', name: 'Xóa', checked: false },
                            { id: 'CUSTOMER_GROUP_IMPORT', name: 'Nhập file', checked: false },
                            { id: 'CUSTOMER_GROUP_EXPORT', name: 'Xuất file', checked: false }
                        ]
                    }
                ]
            },
            {
                id: 'transactions',
                name: 'Đơn hàng',
                checked: false,
                actived: true,
                menus: [
                    {
                        id: 'ORDER',
                        name: 'Quản lý đơn hàng',
                        permissions: [
                            { id: 'ORDER_LIST', name: 'Truy cập', checked: false },
                            { id: 'ORDER_CREATE', name: 'Tạo mới', checked: false },
                            { id: 'ORDER_UPDATE', name: 'Cập nhật', checked: false },
                            { id: 'ORDER_DELETE', name: 'Xóa', checked: false },
                            { id: 'ORDER_IMPORT', name: 'Nhập file', checked: false },
                            { id: 'ORDER_EXPORT', name: 'Xuất file', checked: false }
                        ]
                    }
                ]
            }
        ];
    }
}
