import {newArrayProto} from "./array";

class Observe {
    constructor(data) {
        // 添加属性偏于数据监听，并且如果数据上有__ob__属性说明已经被观测过
        // 将__ob__设置成不可枚举，防止将大当成object循环劫持
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        // 数组不使用劫持函数，因为数组的数量是不固定的，循环起来消耗性能
        // 重写数组的7个修改数组本身的函数
        if(Array.isArray(data)) {
            // 对数组中的object数据类型进行劫持
            data.__proto__ = newArrayProto
            this.observeArray(data)
        } else {
            // 不是数组进行劫持
            this.walk(data)
        }
    }

    /**
     * 循环对象,依次劫持
     * @param data
     */
    walk(data) {
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }

    /**
     * 劫持数组中的object类型数据
     * @param data
     */
    observeArray(data) {
        data.forEach(item => observe(item))
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
    if (data.__ob__ instanceof Observe) return data.__ob__
    // 如果数据上有__ob__属性说明已经被劫持过
    return new Observe(data)
}