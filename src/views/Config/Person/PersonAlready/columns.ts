import type { IPersonConfig } from '@/types/storeType'
import i18n from '@/locales/i18n'

interface IColumnsProps {
    showPrizeTime?: boolean
    handleDeletePerson: (row: IPersonConfig) => void
}

export function tableColumns(props: IColumnsProps) {
    return [
        {
            label: i18n.global.t('data.number'),
            props: 'uid',
            sort: true,
        },
        {
            label: i18n.global.t('data.name'),
            props: 'name',
        },
        {
            label: i18n.global.t('data.avatar'),
            props: 'avatar',
            formatValue(row: any) {
                return row.avatar ? `<img src="${row.avatar}" alt="avatar" style="width: 50px; height: 50px;"/>` : '-'
            },
        },
        {
            label: i18n.global.t('data.department'),
            props: 'department',
        },
        {
            label: i18n.global.t('data.identity'),
            props: 'identity',
        },
        {
            label: i18n.global.t('data.prizeName'),
            props: 'prizeName',
            sort: true,
        },
        props.showPrizeTime && {
            label: i18n.global.t('data.prizeTime'),
            props: 'prizeTime',

        },
        {
            label: i18n.global.t('data.operation'),
            actions: [
                {
                    label: i18n.global.t('data.removePerson'),
                    type: 'btn-info',
                    onClick: (row: IPersonConfig) => {
                        props.handleDeletePerson(row)
                    },
                },
            ],
        },
    ]
}
