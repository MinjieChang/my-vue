function watcher(vm, exp, cb){
  this.vm = vm
  this.exp = exp
  this.cb = cb
  this.value = this.init()
}

watcher.prototype = {
  init(){
    // 缓存自己，把这个watcher添加进监听者花名册中
    Dep.target = this

    // 强制执行 data的getter 函数，从而通过Dep把这个watcher添加进监听者花名册中
    // 也就是 dep.subs 中
    // 如果exp有多级 a.b.c，会调用vm.a.b.c，这样每遍历一次都走到get方法，此时 Dep.target 绑定的是this
    // 就是，a、b、c这三个属性绑定的监听者都是同一个watcher
    let value = getDataVal(this.vm, this.exp)

    // 判断返回的值是否为数组类型
    // 主要是强制取出数组中的元素，判断其中的元素是否为对象，如果是对象，那么如果对象的值发生变化后，就通知数组的观察者
    if(Array.isArray(value)){
      obArray(value)
    }
    // 监听者被添加后释放自己，避免被重复缓存
    Dep.target = null

    return value
  },
  update() {
    let value = this.vm[this.exp]
    let oldVal = this.value

    // 如果是碰到数组，使用的push 或者 pop 方法修改数组，那么value 和 oldVal是相等的，引用的是同一个值
    this.cb.call(this.vm, value, oldVal)
    // if(oldVal !== value ){
    //   this.cb.call(this.vm, value, oldVal)
    // }
  },
}