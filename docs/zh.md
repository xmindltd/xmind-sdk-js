[![Build status](https://ci.appveyor.com/api/projects/status/qll0sp4ny7bl7yo0/branch/master?svg=true)](https://ci.appveyor.com/project/danielsss/xmind-sdk-js/branch/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xmindltd/xmind-sdk-js&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&utm_medium=referral&utm_content=xmindltd/xmind-sdk-js&utm_campaign=Badge_Coverage)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/xmindltd/xmind-sdk-js/master.svg?color=red&label=version)
![GitHub](https://img.shields.io/github/license/xmindltd/xmind-sdk-js.svg)


## 概念简述

[`xmind-sdk-js`](https://github.com/xmindltd/xmind-sdk-js) 库是由 `XMind` 官方开发，并且实现了大部分客户端功能。如果之前使用过 UI 客户端，那么对此库您将不会陌生。

为了方便的使用此库，在开始之前需要了解一个非常重要的概念。

思维导图中每一个节点都可以称之为一个`组件`，且每一个组件都包含一个唯一的`ID`。
所有组件最终将会被构建成为一张树形结构图。

## 安装与导入

#### Node.js 

```shell
$ npm i --save xmind-sdk
```

```js
const {Workbook, Topic, Marker} = require('xmind-sdk');
```

#### 浏览器

```jsx harmony
// JSX
import {Workbook, Topic, Marker} from 'xmind-sdk';
```

```html
// HTML
<script src="https://cdn.jsdelivr.net/npm/xmind-sdk@latest/dist/xmind-sdk-js.bundle.js"></script>
<script>
  const { Workbook, Topic, Marker } = window;
</script>

```

## 应用

```js
const { Workbook, Topic, Marker, Zipper } = require('xmind-sdk');

const [workbook, marker] = [new Workbook(), new Marker()];

const topic = new Topic({sheet: workbook.createSheet('sheet title', 'Central Topic')});
const zipper = new Zipper({path: '/tmp', workbook, filename: 'MyFirstMap'});

// topic.on() default: `central topic`
topic.add({title: 'main topic 1'});

// topic.topicId()
// 在没有参数的情况下，将返回最后一次调用 .add() 添加的组件 ID 或是中心主题 ID
topic
  .on(topic.topicId())
  // 将 `subtopic 1` 添加至 `main topic 1` 节点后
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
   
   // 在 `main topic 1` 上添加笔记
  .note('This is a note attached on main topic 1')
  
  // 在 `subtopic 1` 上添加一个标记图标
  .on(topic.topicId('subtopic 1'))
  .marker(marker.week('fri'))
   
   // 添加一个描述组件，且组件包含 `subtopic 1`，`subtopic 2`
  .summary({title: 'subtopic summary', include: topic.topicId('subtopic 2')})
  
zipper.save().then(status => status && console.log('/tmp/MyFirstMap.xmind 已保存'));
```

## 更多示例

[点击前往示例目录](example)


## Workbook

Workbook 是一个存储了所有组件的临时数据的容器

### 方法

###### .createSheet(sheetTitle, centralTopicTitle) => `Sheet`

* 创建一个`Sheet`实例并将其返回

| 参数 | 类型 | 默认值 | 必须 | 描述 | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | `Sheet` 的主题  |
| centralTopicTitle | String | 'Central Topic' | false | 中心主题名称 |


###### .theme(sheetTitle, themeName) => Boolean

* 设置全局皮肤

| 参数 | 类型 | 默认值 | 必须 | 描述 | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | `Sheet` 的主题  |
| themeName | String | null | true | 可用名称: robust, snowbrush, business|

###### .toJSON() => JSON

* 以 `JSON` 将所有组件数据展示

###### .toString() => String

* 以 `STRING` 将所有组件数据展示


## Topic

### TopicOptions

* `sheet` - Workbook.createSheet(...) 可将返回的实例作为 Topic 的参数


### 方法

###### .cid(title) => String | .topicId(title) => String

###### 

* 如果没有基于中心主题添加任何组件时 `central topicId` 将会返回，否则将返回最后一个被添加组件的ID

* 同样可以使用`title`来获取 ID，但使用时需要特别注意重复的`title`，如果存在重复数据，将返回第一个被找到的组件

###### .cids() => {$topicId: $title} | .topicIds() => {$topicId: $title}

* 将返回一个包含`$id:$title`的数据集合

###### .on(topicId) => Topic

* 将基于ID设置组件为当前父节点，其他添加操作将会基于父节点展开

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| topicId | String | `Central Topic Id` | false | 组件ID |


###### .add(options) => Topic

* 添加组件

| 参数 | 类型 | 默认值 | 必须 | 描述 |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | A title of topic |


###### .note(text) => Topic

* 添加笔记


| 参数 | 类型 | 默认值 | 必须 | 描述 |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | true | A note text message |


###### .marker(options) => Topic

* 添加标记

> [使用 `Marker` 获取 options 参数](#marker-flags)


###### .summary(options) => Topic

* 添加一个带范围的描述对象。注: 不可将其添加至 `Central Topic`

| 参数 | 类型 | 默认值 | 必须 | 描述 |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | null | true | 描述标题 |
| edge | String | null | false | 组件ID，必须与父节点为平行关系 |


> [!`edge` 参数视图简介](docs/edge.graphic.txt)


###### .destroy(topicId) => Topic

* 从树中销毁一个组件。注: 如果组件包含子节点，将会被一起销毁

| 参数 | 类型 | 默认值 | 必须 | 描述 |
|:----:|:----:|:-------:|:--------:|:------------|
| topicId | String | null | true | 组件ID |


## Marker flags

`Marker` 对象实例提供了如下标记组, 可以通过传入具体标记名称获取 .marker 的参数

* **.priority(name: `string`)** - The priority markers

* **.smiley(name: `string`)** - The smiley markers

* **.task(name: `string`)** - The task markers

* **.flag(name: `string`)** - The flag markers

* **.star(name: `string`)** - The star markers

* **.people(name: `string`)** - The people markers

* **.arrow(name: `string`)** - The arrow markers

* **.symbol(name: `string`)** - The symbol markers

* **.month(name: `string`)** - The month markers

* **.week(name: `string`)** - The week markers

* **.half(name: `string`)** - The half markers

* **.other(name: `string`)** - The other markers

> **所有可用 `name` [!点击这里](docs/icons.md)**
> 
> 当然也可以使用静态方法 Marker.groups 和 Marker.names 查看可用 `name`


#### Marker 静态方法

###### Marker.groups() => Array\<groupName\>

* 列出所有可用组名称

###### Marker.names(groupName) => Array\<name\>

* 根据组名称查找可用标记名称


## Zipper

`Zipper` 依赖 `fs` 模块，后端可用

> [浏览器环境请使用 `Dumper`](#dumper)

### ZipperOptions

| 参数 | 类型 | 默认值 | 必须 | 描述 |
|:----:|:----:|:-------:|:--------:|:------------|
| path | String | null | true | `.xmind`文件存储路径 |
| workbook | Workbook | null | true | `Workbook `的实例 |
| filename | String | 'default' | false | `default.xmind` |


###### .save() => Promise\<boolean\>

* 异步方法 `asynchronous`，提取并保存`.xmind`文件

## Dumper

* `Dumper` 浏览器可用

###### .dumping() => Array<{filename: string, value: string}>

* 将返回一个数据数组。每一个元素的`filename`为文件名，`value`为文件数据。最终需要将所有文件保存为`zip`格式，且后缀以`.xmind`结尾的文件 

> **注**
> 
> 制作包文件时需要注意不要将顶级目录包含在其中
