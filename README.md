[![npm (scoped)](https://img.shields.io/npm/v/xmind-sdk.svg)](https://www.npmjs.com/package/xmind-sdk)  [![npm (scoped)](https://img.shields.io/badge/XMind-ZEN-red.svg)](https://www.xmind.net) [![npm (scoped)](https://img.shields.io/badge/Lighten-Pro-purple.svg)](https://lighten.xmind.net)

# XMind-sdk

[The most popular mind mapping software.](https://www.xmind.net)

The [official](https://www.xmind.net/) package.

A core concept must be understood that is `all of the operations` based on `components` and the `title` is a unique string.
Everything is component. such as: `topic` and `note` etc.


## Install

##### Node.js
```shell
$ npm i --save xmind-sdk
```

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
  .on('main topic 1')
  .add({title: 'subtopic 1'}) // add a subtopic on `main topic 1`
  .add({title: 'subtopic 2'})
  .note('this is a note') // add a note text on `main topic 1`
  .on('subtopic 1')
  .marker(marker.week('fri')) // add a marker flag on `subtopic 1`
  .summary({title: 'subtopic summary', include: 'subtopic 2'}) // add a summary component that contains two subtopics
  
wb.zipper.save().then(status => { 
  if (status === true) {
    console.info('/tmp/default.xmind is saved and you can open it with XMind Zen, Lighten.');
  } else {
    console.error('Saving .xmind file is failure.');
  }
});

```

[See more js examples](example/examples.js)

## Workbook(options)

The `Workbook` extends `class Sheet` and has a zip kit.

### Options

* `options.path` - An absolute directory where the `.xmind` file is going to store.
  - default: `Linux | Darwin`: '/tmp' | `Win32`: null

### Methods

* .createSheet(sheetTitle?: `string` = 'sheet-1', centralTopicTitle?: `string` = 'Central Topic') => `Sheet`
  - `sheetTitle` - An unique title string of sheet. default: ['sheet-1']
  - `centralTopicTitle` - An unique title string of central topic. default: ['Central Topic']

* `async` .zipper.save(path?: `string`) => `Promise<boolean>`
  - `path` - The path has priority over `Workbook's options.path`
  

## Topic(options)

### Options

* `options.sheet` - An instance of Sheet

### Methods

##### .on(title?: `string`) => Topic

Set the direction of the internal topic of the instance. default: ['Central Topic']

##### .add(options: {title: `string`, index?: `number`}) => Topic

Add a topic on the topic

##### .note(text: `string`) => Topic

Add a note text on the direction of internal topic

#####  .marker(options:<Marker>{groupId: `string`, markerId: `string`}) => Topic

Add a marker flag on the topic

##### .summary(options: {title: 'summary title', include?: 'a subtopic title'}) => Topic
 
 Add a summary range for topics
 
* title - The summary title
* include - A topic title that must be below in the direction of internal topic

##### .destroy() => Topic

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
