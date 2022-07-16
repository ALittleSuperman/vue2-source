import {initState} from "./state";


export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options // 挂载共享配置

        // 初始化状态
        initState(vm)
    }
}

