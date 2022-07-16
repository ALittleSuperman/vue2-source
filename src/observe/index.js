
class Observe {
    constructor(data) {
        this.walk(data)
    }

    /**
     * 循环对象,依次劫持
     * @param data
     */
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
}

/**
 * 属性劫持
 * @param target 要劫持的目标
 * @param key 要劫持的key
 * @param value key的valve
 * @returns {*}
 */
export function defineReactive(target, key , value) {
    observe(value) // 对所有属性都进行数据劫持,深度劫持
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newVal) {
            if (newVal === value) return
            value = newVal
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) return
    // 如果已经被劫持过，那就不需要劫持了
    return new Observe(data)
}