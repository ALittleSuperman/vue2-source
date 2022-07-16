// 重写数组中的部分函数

// 获取数组的原型
const oldArrayProto = Array.prototype

// 创建新原型，修改新原型函数，不会影响原生函数
export const newArrayProto = Object.create(oldArrayProto)

// 以下函数会改变原数组
const method = [
    "push",
    "pop",
    "shift",
    "unshift",
    "revers",
    "sort",
    "splice",
]

method.forEach(method => {
    newArrayProto[method] = function (...args) {
        // 重写数组的方法，内部调用原来的函数
       const result = oldArrayProto[method].call(this, ...args)

        // 保存修改数组的数据
        let inserted
        let ob = this.__ob__
        switch (method) {
            case "push":
            case "unshift":
                inserted = args
                break
            case "spice":
                inserted = args.slice(2)
        }
        console.log(inserted)
        if (inserted) {
            // 将新数据进行劫持
            ob.observeArray(inserted)
        }
        return result
    }
})


