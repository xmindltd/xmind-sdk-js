[![Build Status](https://travis-ci.org/xmindltd/xmind-sdk-js.svg?branch=master)](https://travis-ci.org/xmindltd/xmind-sdk-js)
[![npm (scoped)](https://img.shields.io/badge/XMind-ZEN-red.svg)](https://www.xmind.net)
[![npm (scoped)](https://img.shields.io/badge/Lighten-Pro-purple.svg)](https://lighten.xmind.net)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xmindltd/xmind-sdk-js&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&utm_medium=referral&utm_content=xmindltd/xmind-sdk-js&utm_campaign=Badge_Coverage)

# Preparing

# XMind-sdk-js

[The most popular mind mapping software.](https://www.xmind.net)

The [`xmind-sdk-js`](https://github.com/xmindltd/xmind-sdk-js) is an official library that implemented a lot of functions as same as the UI client. if you use UI client, you already know how to use this library.

In order to use, there is a very important concept you should know that is everything is component and each of component has a unique **topicId**.

All of the components will be connected like a Map-Tree.

## Getting started

##### Node.js

```shell
$ npm i --save xmind-sdk

const {Workbook, Topic, Marker} = require('xmind-sdk');
```

##### Browser

**Preparing**

## Usage

```js
const { Workbook, Topic, Marker } = require('xmind-sdk');

const wb = new Workbook();
const marker = new Marker();
const sheetName = 'sheet1';
const centralTopicName = 'Central Topic';

const topic = new Topic({sheet: wb.createSheet(sheetName, centralTopicName)});

// topic.on() default: `central topic`
topic.add({title: 'main topic 1'});

topic
  .on(topic.topicId(/*In default, the topic id is last element*/))
  
  // add a subtopic on `main topic 1`
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
   
   // add a note text on `main topic 1`
  .note('this is a note')
  
  // add a marker flag on `subtopic 1`
  .on(topic.topicId('subtopic 1'))
  .marker(marker.week('fri'))
   
   // add a summary component that contains two subtopics
  .summary({title: 'subtopic summary', include: topic.topicId('subtopic 2')})
  
wb.zipper.save().then(status => { 
  if (status === true) {
    console.info('It saved and you can open it with XMind Zen or Lighten.');
  } else {
    console.error('Saving .xmind file is failure.');
  }
});

```
## More Examples

[Click here](example)

## Workbook(options)

The `Workbook` extends `class Sheet` and has a zip kit.

### Options

| Name | Type | Default | System | Description | 
| ---- | ---- | ------- | ------ |:----------- |
| options.path | String | `linux/darwin` | /tmp/default.xmind |  An absolute directory where the `.xmind` file is going to store |
| options.path | String | `Win32` | null | |

### Methods

#### .createSheet(sheetTitle, rootTopicTitle) => `Sheet`

That will create a instance of Sheet and returns

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The unique title string of sheet |
| rootTopicTitle | String | 'Central Topic' | false | The unique title string of central topic |


#### `async` .zipper.save(path) => `Promise<boolean>`
  - `path` - 
 
| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| path | String | null | false | The path has priority over `Workbook's options.path` |
 

## Topic(options)

### Options

* `options.sheet` - An instance of Sheet

### Methods

#### .on(title) => Topic

Set the direction of the internal topic of the instance

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | `Central Topic` | false | The title you added by call `.add()` |

#### .add(options = {title: `string`}) => Topic

Adding a topic component on the internal topic that specified by call `.on()`

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | A title of topic |

#### .note(text) => Topic

Adding a note text on the internal topic

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | true | A note text message |

#### .marker(options:<Marker>{groupId: `string`, markerId: `string`}) => Topic

Adding a marker flag on the internal topic

[Use `Marker Object` to generate the options](#marker-flags)

#### .summary(options: {title: 'summary title', include?: 'a subtopic title'}) => Topic
 
Adding a summary for topics with an optional range
 
| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | null | true | A summary title |
| include | String | null | false | A topic title that must be below in the direction of internal topic |

#### .destroy(title) => Topic

Destroy a topic component from the Map-Tree

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | null | true | The title you added by call `.add()` |

## Marker flags

We provides a instance of `Marker` that includes all the markers. such as below:

* **.priority(name: `string`)** - the priority markers

* **.smiley(name: `string`)** - the smiley markers

* **.task(name: `string`)** - the task markers

* **.flag(name: `string`)** - the flag markers

* **.star(name: `string`)** - the star markers

* **.people(name: `string`)** - the people markers

* **.arrow(name: `string`)** - the arrow markers

* **.symbol(name: `string`)** - the symbol markers

* **.month(name: `string`)** - the month markers

* **.week(name: `string`)** - the week markers

* **.half(name: `string`)** - the half markers

* **.other(name: `string`)** - the other markers

**The `name` of marker available [!here](docs/icons.md)**

## Contributing

If you run into any problems please feel free to reach out to us 🙂.

Also you can PRs immediately.

## LICENSE

MIT License

Copyright (c) 2019 XMind Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
