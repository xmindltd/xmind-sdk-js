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

All of the components will be connected as a Map-tree.

## Getting started

#### Usage in Node.js

```shell
$ npm i --save xmind-sdk

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
  .on(topic.topicId(/*In default, the topic id is last element*/))
  
  // add a subtopic on `main topic 1`
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
   
   // add a note text on `main topic 1`
  .note('This is a note attached on main topic 1')
  
  // add a marker flag on `subtopic 1`
  .on(topic.topicId('subtopic 1'))
  .marker(marker.week('fri'))
   
   // add a summary component that contains two subtopics
  .summary({title: 'subtopic summary', include: topic.topicId('subtopic 2')})
  
zipper.save().then(status => status && console.log('Saved /tmp/MyFirstMap.xmind'));
```

## More Examples

[!Click here](example)

## Workbook() => Workbook

The workbook is a basic container to store the Real-Data of component.

### Methods

#### .createSheet(sheetTitle, centralTopicTitle) => `Sheet`

That will create a instance of Sheet and it will be returned

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The title of sheet that is invisible element |
| centralTopicTitle | String | 'Central Topic' | false | The topic title of central element |


#### .theme(sheetTitle, themeName) => Boolean

Set map theme.

| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| sheetTitle | String | null | true | The sheet title |
| themeName | String | null | true | The names robust, snowbrush, business are available for now |

#### .toJSON() => JSON

Show up components info as `JSON` format.

#### .toString() => String

Show up components info as `STRING` format.

## Zipper(ZipperOptions) => Zipper

#### `async` .save(path) => `Promise<boolean>`
 
| Name | Type | Default | Required | Description | 
|:----:|:----:|:-------:|:--------:|:------------|
| path | String | null | false | The path has priority over `Workbook's options.path` |
 

## Topic(TopicOptions) => Topic

### TopicOptions

* `sheet` - The instance of Workbook.createSheet(...)

### Methods

#### .topicId(title) => String

In default, returns the `central topicId`.

Also, you can get a topicId by the `title` but you should be careful about the title to be repeated, or it will find the first one and return it.

#### .topicIds() => {$topicId: $title}

Gives you an object that contains the pair of `$topicId` and `$title` you have added

#### .on(topicId) => Topic

Set the topicId as parent node and the other methods will depend on it.

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| topicId | String | `Central Topic` | false | The topic that you have added |

#### .add(options) => Topic

The component will be added if you call it with a valid title string.

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| options.title | String | null | true | A title of topic |

#### .note(text) => Topic

Add a note text on the parent node.

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | true | A note text message |

#### .marker(options) => Topic

Add a marker flag on the parent node.

[Use `Marker Object` to generate the options](#marker-flags)

#### .summary(options) => Topic
 
Adding a summary for topics with an optional range
 
| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| title | String | null | true | The Summary title |
| edge | String | null | false | The topicId that must parallel with your parent node |

[!`edge` graphic](docs/edge.graphic.txt)

#### .destroy(topicId) => Topic

Destroy a topic component from the Map-tree.

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| topicId | String | null | true | The topicId that you have added by call `.add()` |

## Marker flags

We provides an instance of `Marker` that includes all the markers. such as below:

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
