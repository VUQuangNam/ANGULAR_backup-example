import { Storage } from 'src/common/models';

export class BaseConfig {
    /**
     * Get unit
     * @public
     */
    public get unitConfig() {
        return [
            {
                id: 2,
                name: 'cái'
            },
            {
                id: 3,
                name: 'm'
            },
            {
                id: 4,
                name: 'gam'
            },
            {
                id: 5,
                name: 'chiếc'
            },
            {
                id: 6,
                name: 'cuộn'
            },
            {
                id: 7,
                name: 'cuyển'
            },
            {
                id: 8,
                name: 'tờ'
            },
            {
                id: 9,
                name: 'bộ'
            },
            {
                id: 10,
                name: 'đôi'
            },
            {
                id: 11,
                name: 'hộp'
            },
            {
                id: 12,
                name: 'thùng'
            }
        ];
    }

    public get cardConfig() {
        return [
            {
                name: 'Teckcombank',
                number: '0123456789456676',
                expiry: null,
                cvc: null
            },
            {
                name: 'VCB',
                number: '0123456789456676',
                expiry: null,
                cvc: null
            },
            {
                name: 'BIDV',
                number: '0123456789456676',
                expiry: null,
                cvc: null
            }
        ];
    }

    public get sourceOrderConfig() {
        return [
            {
                id: 'store',
                name: 'Cửa hàng'
            },
            {
                id: 'sms',
                name: 'SMS'
            },
            {
                id: 'call',
                name: 'CALL'
            },
            {
                id: 'email',
                name: 'EMAIL'
            },
            {
                id: 'social',
                name: 'SOCIAL'
            },
            {
                id: 'website',
                name: 'WEBSITE'
            },
            {
                id: 'voucher',
                name: 'VOUCHER'
            }
        ];
    }

    /**
     * Get current user
     * @public
     */
    public get getUser(): object {
        const user = JSON.parse(
            localStorage.getItem(Storage.USER)
        );
        return user;
    }

    /**
     * Get list stores
     * @public
     */
    public get getLocalStores(): Array<any> {
        const stores = JSON.parse(
            localStorage.getItem(Storage.STORES)
        );
        return stores;
    }
}
