import type { IImage, IPersonConfig } from '@/types/storeType'
import i18n from '@/locales/i18n'

interface IColumnsProps {
    handleDeletePerson: (row: IPersonConfig) => void
}
export function tableColumns(props: IColumnsProps) {
    return [
        {
            label: i18n.global.t('data.number'),
            props: 'uid',
        },
        {
            label: i18n.global.t('data.name'),
            props: 'name',
        },
        {
            label: i18n.global.t('data.department'),
            props: 'department',
        },
        {
            label: i18n.global.t('data.avatar'),
            props: 'avatar',
            buildImageItem(row: any) {
                const imgItem: IImage = {
                    id: row.avatar,
                    name: row.avatar,
                    type: 'user',
                    db: 'avatar',
                    url: row.avatar,
                }
                if (row.avatar.startsWith('http')) {
                    imgItem.type = 'url'
                }
                return imgItem
            },
        },
        {
            label: i18n.global.t('data.identity'),
            props: 'identity',
        },
        {
            label: i18n.global.t('data.isWin'),
            props: 'isWin',
            formatValue(row: IPersonConfig) {
                return row.isWin ? i18n.global.t('data.yes') : i18n.global.t('data.no')
            },
        },
        {
            label: i18n.global.t('data.operation'),
            actions: [
                {
                    label: i18n.global.t('data.delete'),
                    type: 'btn-error',
                    onClick: (row: IPersonConfig) => {
                        props.handleDeletePerson(row)
                    },
                },

            ],
        },
    ]
}
