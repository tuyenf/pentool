export const filteredOptions = (options = [], keyword) => {
    if (keyword && keyword.length > 0) {
        return options.filter(item => {
            if (typeof item === 'object') {
                return item.text.toString().toLowerCase().startsWith(keyword.toLowerCase().trim())
            } else {
                return item.toString().toLowerCase().startsWith(keyword.toLowerCase().trim())
            }
        })
    }
    return options
}