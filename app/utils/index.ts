export const getImageUrl = (path: string | null | undefined) => {
    const config = useRuntimeConfig()
    if (!path) return ''
    if (path.startsWith('http')) return path

    return `${config.public.storage}${path}`
}