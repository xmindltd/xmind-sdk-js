# XMind-sdk-js

[![Build status](https://ci.appveyor.com/api/projects/status/qll0sp4ny7bl7yo0/branch/master?svg=true)](https://ci.appveyor.com/project/danielsss/xmind-sdk-js/branch/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xmindltd/xmind-sdk-js&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&utm_medium=referral&utm_content=xmindltd/xmind-sdk-js&utm_campaign=Badge_Coverage)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/xmindltd/xmind-sdk-js/master.svg?color=red&label=version)
![GitHub](https://img.shields.io/github/license/xmindltd/xmind-sdk-js.svg)

The [`xmind-sdk-js`](https://github.com/xmindltd/xmind-sdk-js) is an official library that implements a lot of functions as same as the UI client. If you use UI client, you could have already known how to use this library.

In order to use conveniently, a very important concept you should know is that everything is component and each of component has a unique `componentId`.

All of the components will be connected as a map tree.

## Getting started

#### Usage in Node.js

```shell
$ npm i --save xmind-sdk
```

```js
const {Workbook, Topic, Marker} = require('xmind-sdk');
```

#### Usage in Browser

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

## Usage

```js
const { Workbook, Topic, Marker, Zipper } = require('xmind-sdk');

const [workbook, marker] = [new Workbook(), new Marker()];

const topic = new Topic({sheet: workbook.createSheet('sheet title', 'Central Topic')});
const zipper = new Zipper({path: '/tmp', workbook, filename: 'MyFirstMap'});

// topic.on() default: `central topic`
topic.add({title: 'main topic 1'});

topic
  .on(topic.cid(/*In default, the componentId is last element*/))
  
  // add a subtopic on `main topic 1`
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
   
   // add a note text on `main topic 1`
  .note('This is a note attached on main topic 1')
  
  // add a marker flag on `subtopic 1`
  .on(topic.cid('subtopic 1'))
  .marker(marker.week('fri'))
   
   // add a summary component that contains two subtopics
  .summary({title: 'subtopic summary', include: topic.cid('subtopic 2')})
  
zipper.save().then(status => status && console.log('Saved /tmp/MyFirstMap.xmind'));
```

## More Examples

[Go to examples directory](../example)


## Workbook

The workbook is a basic container to store the temporary data of components

### Methods

###### .createSheet(sheetTitle, centralTopicTitle) => `Sheet`

* That will create a instance of Sheet

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The title of sheet |
| centralTopicTitle | String | 'Central Topic' | false | The title of central topic |


###### .theme(sheetTitle, themeName) => Boolean

* Set map global theme

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The sheet title |
| themeName | String | null | true | The names robust, snowbrush, business are available for now |

###### .toJSON() => JSON

* Gives all the components as `JSON` format

###### .toString() => String

* Gives all the components as `STRING` format


## Topic

### TopicOptions

* `sheet` - The `Topic` needs an instance of Sheet for components management

### Methods

###### .cid(title) => String

* In default, returns the `central topic id` if title does not given

* Also, you can get a componentId by the `title` but you should be careful about the title to be repeated, or it will find the first one and return it

###### .cids() => {$cid: $title}

* Gives an object that contains the pair of `$componentId` and `$title` you have added

###### .on(componentId) => Topic

* Set the component as parent node and the operation of `Topic` depends on it

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| componentId | String | `Central Topic` | false | The componentId that you have added |


###### .add(options) => Topic

* The topic will be added if you call it with a valid title string

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | the title of topic |


###### .note(text) => Topic

* Add a note text on the parent node

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | true | A note text message |


###### .marker(options) => Topic

* Add a marker flag on the parent node

> [Use `Marker Object` to generate the options](#marker-flags)


###### .summary(options) => Topic

* Add a summary for components with an optional range, but cannot add summary on the `Central Topic`

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | null | true | The Summary title |
| edge | String | null | false | The componentId that must parallel with your parent node |


> [!`edge` graphic](edge.graphic.txt)


###### .destroy(componentId) => Topic

* Destroy a component from the map tree

* The children will be disappeared if the parent node was destroyed

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| componentId | String | null | true | The componentId that you have added |


## Marker flags

We provides an instance of `Marker` that includes all the markers. such as below:

###### .priority(name: `string`)

###### .smiley(name: `string`)

###### .task(name: `string`)

###### .flag(name: `string`)

###### .star(name: `string`)

###### .people(name: `string`)

###### .arrow(name: `string`)

###### .symbol(name: `string`)

###### .month(name: `string`)

###### .week(name: `string`)

###### .half(name: `string`)

###### .other(name: `string`)

> **The `name` of marker available [!here](icons.md)**
> 
> You also can use the static methods Marker.groups and Marker.names to find out available name


#### Static methods

###### Marker.groups() => Array\<groupName\>

* List all available group names

###### Marker.names(groupName) => Array\<name\>

* Get the flag names by `groupName`


## Zipper

The Zipper only works on backend.

> [!See `Dumper` in browser environment](#dumper)

### ZipperOptions

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| path | String | null | true | The path where the .xmind file to save |
| workbook | Workbook | null | true | The instance of Workbook |
| filename | String | 'default' | false | `default.xmind` |


###### .save() => Promise\<boolean\>

* Save all components to the logic disk in zip format

## Dumper

* The Dumper only works on browser

###### .dumping() => Array<{filename: string, value: string}>

* Returns an array of the object that composed of file contents

* In order to open it on the official software, You need to compress all the files in zip format and end with `.xmind`

> **Important**
> 
> Do not includes the top level folder, or the software won't extra file from top level folder
