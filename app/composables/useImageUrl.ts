export const useImageUrl = () => {
    const config = useRuntimeConfig()

    const getImageUrl = (path: string | null | undefined) => {
        if (!path) return ''
        if (path.startsWith('http')) return path

        return `${config.public.storage}${path}`
    }

    return { getImageUrl }
}