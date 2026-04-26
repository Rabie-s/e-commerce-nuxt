export const getStatusClasses = (color?: string) => {
    switch (color) {
        case 'success':
            return 'bg-green-100 text-green-700'
        case 'danger':
        case 'error':
            return 'bg-red-100 text-red-700'
        case 'warning':
            return 'bg-orange-100 text-orange-700'
        case 'info':
            return 'bg-blue-100 text-blue-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}