import {observe} from "./observe/index";

export function initState(vm) {
    const opts = vm.$options // 获取所有选项
    if (opts.data) {
        initData(vm)
    }
}

// 代理
function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newVal) {
            vm[target][key] = newVal
        }
    })
}

function initData(vm) {
    let data = vm.$options.data
    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data
    // 使用defineProperty 劫持数据
    observe(data)

    // vm代理vm._data方便取值
   for(let key in data) {
       proxy(vm, '_data', key)
   }
}
