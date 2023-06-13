# 事件说明

## 事件表

### 各种状态下的事件

|  事件名称   | 事件说明  | 回调参数 |
|  ----  | ----  |  ----  | 
| start-add  | 移动端(触摸开始) pc端(鼠标按下) 添加状态下 | UserEvent 事件对象 |
| move-add  | 移动端(触摸移动) pc端(鼠标移动) 添加状态下| UserEvent 事件对象 |
| end-add  | 移动端(触摸结束) pc端(鼠标抬起) 添加状态下| UserEvent 事件对象 |
| click-add  | 移动端敲击(有效间隔是150ms) pc端点击(有效间隔是150ms) 添加状态下| UserEvent 事件对象 |
| start-edit | 移动端(触摸开始) pc端(鼠标按下) 编辑状态下 | UserEvent 事件对象 |
| move-edit | 移动端(触摸移动) pc端(鼠标移动) 编辑状态下 | UserEvent 事件对象 |
| end-edit | 移动端(触摸结束) pc端(鼠标抬起) 编辑状态下 | UserEvent 事件对象 |
| start-control | 移动端(触摸开始) pc端(鼠标按下) 选择控件状态下 | UserEvent 事件对象 |
| move-control | 移动端(触摸移动) pc端(鼠标移动) 选择控件状态下 | UserEvent 事件对象 |
| end-control | 移动端(触摸结束) pc端(鼠标抬起) 选择控件状态下 | UserEvent 事件对象 |

### 基础事件表

|  事件名称   | 事件说明  | 回调参数 |
|  ----  | ----  |  ----  | 
| start  | 移动端(触摸开始) pc端(鼠标按下) | UserEvent 事件对象 |
| move  | 移动端(触摸移动) pc端(鼠标移动) | UserEvent 事件对象 |
| end  | 移动端(触摸结束) pc端(鼠标抬起) | UserEvent 事件对象 |
| click  | 移动端敲击(有效间隔是150ms) pc端点击(有效间隔是150ms) | UserEvent 事件对象 |
| dblclick  | 移动端双敲击(有效间隔是150ms) pc端双点击(有效间隔是150ms) | UserEvent 事件对象 |


### 绘制事件表

|  事件名称   | 事件说明  | 回调参数 |
|  ----  | ----  |  ----  | 
| drawCall | 绘制操作层的回调事件 一般在新增层类型中使用 | {layer:Layer,ctx:ctx} |
| drawControl | 绘制操作层的操作回调 一般在新增层类型中使用 | 无 |


### 层事件 

|  事件名称   | 事件说明  | 回调参数 |
|  ----  | ----  |  ----  | 
| addLayered | 添加层并且绘制结束过后触发的回调 | layer |
| remLayer | 移出层但没有重绘完成触发的回调 | layer |
| createControl | 创建层的控制视图 | layer |
| clickLayer | 点击视图层触发函数 |layer |
| startLayer | 开始拖动层触发函数 |Object|
| moveLayer | 拖动中触发函数 |Object|
| endLayer | 拖动层结束触发函数 |Object|
| startControlLayer | 开始拖动点点触发函数 |Object|
| moveControlLayer | 拖动点点中触发函数 |Object|
| endControlLayer | 拖动点点结束触发函数 |Object|