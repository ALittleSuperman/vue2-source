const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始标签的名字
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>
// vue3 采用的不是使用正则
// 对模板进行编译处理

/**
 * 解析html字符串
 * @description 每次解析返回返回未解析的生育字符串
 * @param template
 */
function parseHTML(html) {
    /**
     * 匹配完成后前进函数
     * @description 匹配完成一次少一段代码，直到字符串为空
     * @param n
     */
    function advance(n) {
        html = html.substring(n)
    }
    /**
     * 解析开始标签
     * @description 生成对象
     */
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if(start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: [] // 属性列表
            }
            advance(start[0].length)

            // 如果不是开始标签的结束就一直匹配下去
            let attr, end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false
    }
    // html字符串以<开头
    while (html) {
        /*
         * 如果textEnd为0，则说明是一个标签
         * 如果textEnd大于0，则说明是文本结束位置
         */
        const textEnd = html.indexOf('<')
        // 处理标签
        if(textEnd === 0) {
            // 解析开始标签
            const startTagMatch = parseStartTag()
            // 解析到文本标签
            if(startTagMatch){
                continue
            }

            // 处理结束标签
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                continue
            }
        }
        // 处理文本
        if(textEnd > 0) {
            // 截取文本内容
            const text = html.substring(0, textEnd)
            if(text) {
                advance(text.length)
            }
        }
    }
}

// 模版编译函数
export function compileToFunction(template) {
    // 1。将template转换成ast语法树
    const ast = parseHTML(template)
    console.log(ast)
    // 2。生成render函数（render函数执行后返回虚拟dom）

    console.log(template)
}