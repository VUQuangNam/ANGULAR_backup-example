export enum FilterInputTypes {
    INPUT_TEXT = 'text',
    INPUT_NUMBER = 'number',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',

    // Date Group
    DATE_TIME = 'date_time',
    DATE_RANGE = 'date_range',

    // SELECT GROUP
    SELECT = 'select',
    SELECT_SEARCH = 'select_search',
    SELECT_MULTIPLE = 'select_multiple',
}

export class FilterModel {
    title: string;
    active: boolean;
    conditions: [
        {
            key: string; // name for input
            type: string; // type for input
            lable: string; // text for input
            value: string; // only for input
            checked: boolean; // only for radio and checkbox

            // option only for checkbox & select box
            options?: [
                {
                    id: string;
                    name: string;
                }
            ],

            // get data from service
            service?: {
                uri: string;
                respone: string;
            };

            // configuration
            config?: {
                edit: boolean; // show button edit
                info: boolean; // show button xem thong tin
                search: boolean; // show tim kiem data tren dau group
            },
        }
    ];
    config: {
        show: boolean; // show button ẩn hiện form
        info: boolean; // show button xem thong tin
        create: boolean; // show button them moi (show modal them moi)
        modalRef: string; // id modal them moi || chinh sua
    };
}
