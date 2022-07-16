(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // 重写数组中的部分函数
  // 获取数组的原型
  var oldArrayProto = Array.prototype; // 创建新原型，修改新原型函数，不会影响原生函数

  var newArrayProto = Object.create(oldArrayProto); // 以下函数会改变原数组

  var method = ["push", "pop", "shift", "unshift", "revers", "sort", "splice"];
  method.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 重写数组的方法，内部调用原来的函数
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args)); // 保存修改数组的数据


      var inserted;
      var ob = this.__ob__;

      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;

        case "spice":
          inserted = args.slice(2);
      }

      console.log(inserted);

      if (inserted) {
        // 将新数据进行劫持
        ob.observeArray(inserted);
      }

      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      // 添加属性偏于数据监听，并且如果数据上有__ob__属性说明已经被观测过
      // 将__ob__设置成不可枚举，防止将大当成object循环劫持
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      }); // 数组不使用劫持函数，因为数组的数量是不固定的，循环起来消耗性能
      // 重写数组的7个修改数组本身的函数

      if (Array.isArray(data)) {
        // 对数组中的object数据类型进行劫持
        data.__proto__ = newArrayProto;
        this.observeArray(data);
      } else {
        // 不是数组进行劫持
        this.walk(data);
      }
    }
    /**
     * 循环对象,依次劫持
     * @param data
     */


    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
      /**
       * 劫持数组中的object类型数据
       * @param data
       */

    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observe;
  }();
  /**
   * 属性劫持
   * @param target 要劫持的目标
   * @param key 要劫持的key
   * @param value key的valve
   * @returns {*}
   */


  function defineReactive(target, key, value) {
    observe(value); // 对所有属性都进行数据劫持,深度劫持

    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (newVal === value) return;
        value = newVal;
      }
    });
  }
  function observe(data) {
    if (_typeof(data) !== 'object' || data === null) return; // 如果已经被劫持过，那就不需要劫持了

    if (data.__ob__ instanceof Observe) return data.__ob__; // 如果数据上有__ob__属性说明已经被劫持过

    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options; // 获取所有选项

    if (opts.data) {
      initData(vm);
    }
  } // 代理

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newVal) {
        vm[target][key] = newVal;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; // 使用defineProperty 劫持数据

    observe(data); // vm代理vm._data方便取值

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 模版编译函数
  function compileToFunction(template) {
    // 1。将template转换成ast语法树
    // 2。生成render函数（render函数执行后返回虚拟dom）
    console.log(template);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 挂载共享配置
      // 初始化状态

      initState(vm); // 处理模版

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var opts = vm.$options; // 先进行查找render

      if (!opts.render) {
        // 如果不存在render函数，查看有没有template参数
        var template;

        if (!opts.template && el) {
          // 没有template属性使用挂载容器内的模版
          template = el.outerHTML;
        } else {
          if (el) {
            // 存在template属性就使用传入的template属性模版
            template = opts.template;
          }
        }

        if (template) {
          // 编译模版
          var render = compileToFunction(template);
          opts.render = render;
        } else {
          console.warn("没有模版信息");
        }
      }

      opts.render;
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
