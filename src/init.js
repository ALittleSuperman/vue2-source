import {initState} from "./state";
import {compileToFunction} from "./complie";


export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options // 挂载共享配置

        // 初始化状态
        initState(vm)

        // 处理模版
        if(options.el) {
            vm.$mount(options.el)
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)
        const opts = vm.$options
        // 先进行查找render
        if (!opts.render) {
            // 如果不存在render函数，查看有没有template参数
            let template
            if(!opts.template && el) {
                // 没有template属性使用挂载容器内的模版
                template = el.outerHTML
            } else  {
                if (el) {
                    // 存在template属性就使用传入的template属性模版
                    template = opts.template
                }
            }
            if (template) {
                // 编译模版
                const render = compileToFunction(template)
                opts.render = render
            } else {
                console.warn("没有模版信息")
            }
        }
        opts.render
    }
}

