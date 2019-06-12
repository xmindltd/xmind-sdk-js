# xmind-sdk-js

[![Build Status](https://travis-ci.org/xmindltd/xmind-sdk-js.svg?branch=master)](https://travis-ci.org/xmindltd/xmind-sdk-js)
[![Build status](https://ci.appveyor.com/api/projects/status/qll0sp4ny7bl7yo0/branch/master?svg=true)](https://ci.appveyor.com/project/danielsss/xmind-sdk-js/branch/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xmindltd/xmind-sdk-js&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&utm_medium=referral&utm_content=xmindltd/xmind-sdk-js&utm_campaign=Badge_Coverage)
![GitHub package.json version (branch)](https://img.shields.io/github/package-json/v/xmindltd/xmind-sdk-js/master.svg?color=red&label=version)
![GitHub](https://img.shields.io/github/license/xmindltd/xmind-sdk-js.svg)

This [project](https://github.com/xmindltd/xmind-sdk-js) is an official library that implements various functions which is similar to UI client. If you had access to UI client, you could have already known how to use this library.

In order to use conveniently, an essential concept you should know is that everything is component and each one of them has a unique component ID. You can add child nodes under the component, however, the `Marker` and `Note` can only be attached to the component.

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

## Simple example

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
   
   // add a text note on `main topic 1`
  .note('This is a note attached on main topic 1')
  
  // add a marker flag on `subtopic 1`
  .on(topic.cid('subtopic 1'))
  .marker(marker.week('fri'))
   
   // add a component of the summary that contains two sub topics
  .summary({title: 'subtopic summary', include: topic.cid('subtopic 2')})
  
zipper.save().then(status => status && console.log('Saved /tmp/MyFirstMap.xmind'));
```

## More Examples

[Go to example directory](../example)


## Workbook

The `Workbook` is a primary container that stores temporary data for all components

### Methods

###### .createSheet(sheetTitle, centralTopicTitle) => `Sheet`

* It will create an instance of the `Sheet`

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The title of `Sheet` |
| centralTopicTitle | String | 'Central Topic' | false | The title of `Central Topic` |


###### .theme(sheetTitle, themeName) => Boolean

* Set the background theme

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The title of `Sheet` |
| themeName | String | null | true | Only supports `robust, snowbrush, business` for now |

###### .toJSON() => JSON

* Return component's data in the form `JSON`

###### .toString() => String

* Return component's data in the form `STRING`

## Topic

### Topic Options

* `sheet` - The value returns from `Workbook.createSheet()`

### Methods

###### .cid(title?) => String

* Use .cid to get component ID corresponding to the `title`

> _!!! NOTE THAT_
>
> _You should avoid duplication of component `title` if use the `title` lookups_

* At least the ID of central topic will return if does not add any component

* If there is no `title`, it will return the last component's ID you have added

###### .cids() => {$cid: $title}

* It will return an object that contains `$componentId` and `$title`

###### .on(componentId?) => Topic

* Set the component of corresponding to `componentId` to be parent component


###### .add(options) => Topic

* Add a topic component under the parent component

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | the title of topic |
| options.index | Number | null | false | coming soon |


###### .note(text) => Topic

* To attach a text to the parent component

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | true | Text message |


###### .marker(object) => Topic

* To attach a marker flag to the parent component

* Also, you can detach a marker flag from the parent component by setting the `object.del` to `true`. default: `false`

Example:

```js
const {Marker} = require('xmind-sdk');
const marker = new Marker();
// add
topic.marker(marker.smiley('cry'));
// del
topic.marker(Object.assign({}, marker.smiley('cry'), {del: true}));
```

> [Use `Marker Object` to generate the object](#marker-flags)


###### .summary(options) => Topic

* Add a component of summary under the parent component that allows using `edge` for a scope, but not allows to add summary under the `Central Topic`

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | The title of summary |
| options.edge | String | null | false | The component ID that must parallel with your parent component |


> [!`edge` graphic](edge.graphic.txt)


###### .destroy(componentId) => Topic

* Destroy a component from the map tree

> _!!! IMPORTANT_
>
> The nodes under the parent component are going to destroy with it.


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

> **The `name` of marker is available [!here](icons.md)**
> 
> You can also use the `static method` Marker.groups and Marker.names to find out available name


#### Static methods

###### Marker.groups() => Array\<groupName\>

* List available group names

###### Marker.names(groupName) => Array\<name\>

* Get the flag names by `groupName`


## Zipper

The module of `Zipper` only works under backend

> [!See `Dumper` in browser environment](#dumper)

### Zipper Options

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| options.path | String | null | true | The path where the .xmind file to save |
| options.workbook | Workbook | null | true | The instance of Workbook |
| options.filename | String | 'default' | false | `default.xmind` |


###### .save() => Promise\<boolean\>

* To save components to the logic disk in form zip

## Dumper

* The module of `Dumper` only works under browser

###### .dumping() => Array<{filename: string, value: string}>

* Return an array of the object that is composed of file content

* In order to open it in the official software, You need to compress file in form zip and ending with `.xmind`

> **Important**
> 
> Do not include the top level folder, otherwise the software won't extra the files from top level folder
