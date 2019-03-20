
### Object.defineProperty 

```javascript
let obj = {}
//默认不可配置、不可改变、不可枚举
Object.defineProperty(obj, 'school', {
    configurable: true, // 是否可配置 (删除)
    writable: true, // 是否可改变
    enumerable: true,  // 是否可枚举
    value: 'ljw',

    get() {
        return 'kobe'
    },
    set(val) {

        console.log('改变了');
    }
})
// delete obj.school;
obj.school = 'LBJ'

console.log(obj.school);
for (let key in obj) {
    console.log(key);

}

```
通过上述代码尝试，可以得知
`Object.defineProperty` 创建出来的对象特点

- 默认不可配置、不可改变、不可枚举
- 如果使用`get` 和 `set` 属性， 则不能设置 `writable` 和 `value`

### 数据劫持

Vue实例
```html
<div id="app">
    {{a}}
</div>
<script src="./mvvm_demo.js"></script>
<script>
let nice = new Nice({
    el:'#app',
    data:{a:{b:2}}
})
</script>
```

数据劫持
```javascript
function Nice(options = {}) {
     //将所有属性挂载到$options 类似 vm.$options
     this.$options = options;
    // 在实例上在挂一个属性 this._data
    var data = this._data = this.$options.data;

    observe(data) // 观测对象变化

}

function observe(data) { // 观测对象变化，给对象添加Object.defineProperty
    return new Observe(data)
}

function Observe(data) { //这里写主要逻辑
    for (let key in data) {
        //把 data 属性通过object.defineProperty 的方式 定义属性
       
       let val = data[key]

       //定义属性
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                return val 
            },
            set(newVal) { //更改值的时候
                if(newVal === val) {
                    return
                }
                val = newVal // 以后获取的时候是更改后的新值
                observe(newVal) //实现深度数据劫持（设置为新值后依然能有get 和 set）
            }
        })
    }
}
```
![](https://upload-images.jianshu.io/upload_images/9249356-14454fa7fcb417b8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![](https://upload-images.jianshu.io/upload_images/9249356-b28775137390f0cf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![](https://upload-images.jianshu.io/upload_images/9249356-7b38dbf79fcfb982.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


- **注意**属性 a 可能很复杂，所以遍历 a 的时候，如果a的属性是对象，需要递归观察对象，给其设置 `set` 和 `get`
- vue 特点不能新增不存在的属性，不存在的属性没有get和set，那么vue 就不能监控它的变化，也就不能做到响应式
- 深度响应: 因为每次赋予一个新对象时，会给这个新对象增加数据劫持(递归设置Object.defineProperty， 深度数据劫持)

### 数据代理
```javascript
function Nice(options = {}) {
    this.$options = options; //将所有属性挂载到$options
    // this._data
    var data = this._data = this.$options.data;
    observe(data)

    //数据代理 this 代理了 this._data
    for(let key in data) {
        Object.defineProperty(this,key,{
            enumerable:true, //可枚举
            get(){
                return this._data[key] //this.a = 
            },
            set(newVal){
                this._data[key] = newVal
            }
        })
    }    
}
```
使用 this 代理了 `this._data` (类比于**Vue中可以直接用this访问data里的属性**)

### 编译模板

