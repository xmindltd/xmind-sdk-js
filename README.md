# XMind SDK for JavaScript

[![Build Status](https://travis-ci.org/xmindltd/xmind-sdk-js.svg?branch=master)](https://travis-ci.org/xmindltd/xmind-sdk-js)
[![Build status](https://ci.appveyor.com/api/projects/status/qll0sp4ny7bl7yo0/branch/master?svg=true)](https://ci.appveyor.com/project/danielsss/xmind-sdk-js/branch/master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xmindltd/xmind-sdk-js&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/36420399770547e4825f0657eb29118b)](https://www.codacy.com/app/danielsss/xmind-sdk-js?utm_source=github.com&utm_medium=referral&utm_content=xmindltd/xmind-sdk-js&utm_campaign=Badge_Coverage)
![npm](https://img.shields.io/npm/v/xmind-sdk.svg?color=red&label=version)
![GitHub](https://img.shields.io/github/license/xmindltd/xmind-sdk-js.svg)
[![npm (scoped)](https://img.shields.io/badge/XMind-ZEN-red.svg)](https://www.xmind.net)

The official XMind SDK for JavaScript (written by typescript), available for browsers and Node.js backends.

This library implements various functions which is similar to our client. If you have used our client before, you will know how to use this library.

In order to use the SDK conveniently, an essential concept you should know is that everything is component and each one of them has a unique component ID. You can add child nodes under the components, however, the Markers and Notes can only be attached to the components.

You can open the final `.xmind` files by XMind ZEN.

Supported Platforms:
* Linux  
* Win32  
* Browser

## Usage and Getting Started

### Usage in Node.js

```shell
$ npm i --save xmind-sdk
```

```js
const {Workbook, Topic, Marker} = require('xmind-sdk');
```

### Usage in Browser

```jsx harmony
import {Workbook, Topic, Marker} from 'xmind-sdk';
```

```html
// HTML
// Latest version
<script src="https://cdn.jsdelivr.net/npm/xmind-sdk/dist/xmind-sdk.bundle.js"></script>
// Specify version
<!-- script src="https://cdn.jsdelivr.net/npm/xmind-sdk@1.1.0/dist/xmind-sdk.bundle.js"></script -->

<script>
  const { Workbook, Topic, Marker } = window;
</script>

```

### Simple Usage


```js
const { Workbook, Topic, Marker, Zipper } = require('xmind-sdk');

const [workbook, marker] = [new Workbook(), new Marker()];

const topic = new Topic({sheet: workbook.createSheet('sheet title', 'Central Topic')});
const zipper = new Zipper({path: '/tmp', workbook, filename: 'MyFirstMap'});

// topic.on() default: `central topic`
topic.add({title: 'main topic 1'});

topic
  .on(topic.cid(/*In default, the componentId is last element*/))
  
  // add subtopics under `main topic 1`
  .add({title: 'subtopic 1'})
  .add({title: 'subtopic 2'})
   
   // attach text note to `main topic 1`
  .note('This is a note attached on main topic 1')
  
  // attach a marker flag to `subtopic 1`
  .on(topic.cid('subtopic 1'))
  .marker(marker.week('fri'))
   
   // add a component of the summary that contains two sub topics
  .summary({title: 'subtopic summary', edge: topic.cid('subtopic 2')})
  
zipper.save().then(status => status && console.log('Saved /tmp/MyFirstMap.xmind'));
```

### More Examples

See [example directory](../example).


### Workbook

The workbook is a temporary storage where all the data are written.

### Methods

#### .createSheet(sheetTitle, topicTitle?) => `Sheet`

Once the workbook is created, then there's a way to build a sheet containing a `root topic`. In addition, you can custom their titles by parameters.


| Name | Type | Default | Required |
|:---- |:----:|:-------:|:--------:|
| sheetTitle | String | `-` | Y |
| topicTitle | String | `Central Topic` | N |


#### .theme(sheetTitle, themeName) => Boolean

The `UI client` has many theme styles and this library also offers some of them, such as `robust / snowbrush / business`.

| Name | Type | Default | Required |
|:---- |:----:|:-------:|:--------:|
| sheetTitle | String | null | Y |
| themeName | String | null | Y |

#### .toJSON()

Get component's data from the workbook in the form of `JSON`.

#### .toString()

Get component's data from the workbook in the form of `STRING`.

#### .validate() => `{status: Boolean, errors: Array<object> | null}`

This is proof that all data are available and complete.

The `status` indicates the result of validation which is `true` if it's correct, othewise `false` returns.

### Topic

The `Topic` is an important constructor function that implements most of the methods. And you are going to depend on it during most operations.

### Topic Options

* options.sheet <= `workbook.createSheet(...)`

You may wonder why we need to offer the `options.sheet` manually? The reason is that `Topic` is implemented independently and most of the methods depend on the instance of the sheet.

In the UI client, you also need to draw the mind map on sheet.

> usage:
> 
> ```js
> const {Topic, Workbook} = require('xmind-sdk');
> const wb = new Workbook();
> 
> new Topic({sheet: wb.createSheet('Sheet-1', 'topic-1')});
> ```

### Methods

#### .on(componentId?) => Topic

Set the component to be parent node. If there isn't component ID, the `Central Topic` will become as parent node.

#### .cid(title?) => String

Use .cid to get component ID corresponding to the `title`.
> _!!! NOTE THAT:_  You should avoid duplicating the component `title` if use `title` to search the component ID.

If none of the components has been added, at least `Central Topic`'ID could be returned.

If you don't specify title in the period of calling .cid, the last added component ID would be returned.

#### .cids() => {$cid: $title}

That will return all added components.

#### .add(options) => Topic

Add a topic component under parent node.

| Name | Type | Default | Required |
|:----:|:----:|:-------:|:--------:|
| options.title | String | null | Y |


#### .note(text, del?) => Topic

Attach a text to parent node.

| Name | Type | Default | Required | Description |
|:----:|:----:|:-------:|:--------:|:------------|
| text | String | null | Y | text message |
| del | Boolean | false | N | detach the note from current parent node if the `del` is true |


#### .marker(object) => Topic

Attach a marker flag to the parent node. Moreover, you can detach a marker flag from the parent node by setting `object.del` as `true`. default: `false`

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


#### .summary(options) => Topic

Attach a summary component to parent node including all children. In the meantime, the `edge` can be used to set the scope of summary component.
> _!!! NOTE THAT_
> 
> The summary does not allow to be added under `Central Topic`
> 
> The `edge` must parallel to parent node

| Name | Type | Default | Required |
|:---- |:----:|:-------:|:--------:|
| options.title | String | null | Y |
| options.edge | String | null | N | 


> [!`edge` graphic](./edge.graphic.txt)


#### .destroy(componentId) => Topic

Destroy a component from the map tree.

> _!!! NOTE THAT_
>
> All children would be destroyed along with it 


### Marker flags

We provide an instance of `Marker` that includes all the markers. Such as:

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
> You also can use **Marker.groups** and **Marker.names** to find out available names


### Static methods

#### Marker.groups() => Array\<groupName\>

List available group names.

#### Marker.names(groupName) => Array\<name\>

* Get the flag names by `groupName`.


### Zipper

The module of `Zipper` only works under backend.

> [!See `Dumper` in browser environment](#dumper)

### Zipper Options

| Name | Type | Default | Required | Description | 
|:---- |:----:|:-------:|:--------:|:------------|
| options.path | String | `-` | Y | The path is where to save the `.xmind` file |
| options.workbook | Workbook | `-` | Y | The instance of Workbook |
| options.filename | String | default | N | `default.xmind` |

#### .updateManifestMetadata(key, content) => Zipper

Update manifest for image insertion.

| Name | Type | Default | Required | Description | 
|:---- |:----:|:-------:|:--------:|:------------|
| key | String | null | Y | The key only can be get by topic.image() |
| content | Buffer | null | Y | The buffer data of image |

#### .removeManifestMetadata(key) => Zipper

Remove a pair of key/value from manifest.

#### .save() => Promise\<boolean\>

Save components to the logic disk in the form of zip.

### Dumper

The module of `Dumper` only works under browser.

#### .dumping() => Array<{filename: string, value: string}>

Return an array of the object composed of file content. In order to open it in the official software, you need to compress these files in the form of zip with end of `.xmind`.

> **Important**
> 
> Do not include top level folders, otherwise the software can't extract files

## Contributing
Thank you for be interesting in the SDK.

If you have any problems or suggestions please let us know 🙂

We also welcome you to submit a pull request for any big or small issues.

## License

See the [MIT License](LICENSE).
