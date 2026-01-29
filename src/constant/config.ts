export const SINGLE_TIME_MAX_PERSON_COUNT = 30

export const FILE_TYPE = {
    '': '*',
    'folder': 'folder',
    'image': '.png,.jpg,.jpeg,.gif,.bmp,.webp,.tiff,.svg,.avif',
    // 'image': 'image/*',
    // 'audio': 'audio/*',
    'audio': '.flac,.webm,.weba,.wav,.m4a,.mp3,.oga,.mid,.amr,.wma,.au,.aac',
    // 'video': 'video/*',
    'video': '.mpe,.mpeg,.ogm,.wmv,.mpg,.webm,.ogv,.mov,.m4v,.asx,.mp4,.avi',
    // 'zip': 'application/zip,application/x-rar-compressed,application/x-7z-compressed,application/x-tar,application/gzip',
    'zip': '.zip',
    // 'json': 'text/json',
    'json': '.json',
    // 'excel': 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'excel': '.xls,.xlsx',
} as const

export const AVATAR_MAX_SIZE = 1024 * 40
