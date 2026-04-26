export const formatPrice = (price: string | number): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price

    if (isNaN(numPrice)) return 'JOD 0.000'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'JOD',
        minimumFractionDigits: 3
    }).format(numPrice)
}