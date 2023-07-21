'use strict';

/**
 * Loader fully example
 */

const {Topic, Zipper,Loader} = require('xmind');
// const {Loader} = require('xmind')
// const {Topic} = require('../dist/')
// const {Zipper} = require('../dist/')
// const {Loader} = require('../dist/')
// import {Loader} from '../src/utils/loader'
const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');
const v4 = require('uuid').v4;

const main = async () => {
  const file = fs.readFileSync(path.resolve(__dirname, '../test/fixtures/default.xmind'));
  const loader = new Loader({ctx: await JSZip.loadAsync(file)});
  const sheets = await loader.loadSheets();
  
  let sheet;
  for (const key in sheets) {
    if (sheets[key].getTitle() === 'sheet-1') {
      sheet = sheets[key];
    }
  }
  
  const topic = new Topic({sheet: sheet, isLoaded: true});
  
  // const resource = topic.cids();
  // const kids = sheet.getRootTopic().getChildren().children.attached;
  // const parentId = sheet.getRootTopic().id;
  // console.log(kids);
  // console.log('Children ids');
  // const kid1 = kids[0];
  // kids.forEach((kid) =>{
  //   console.log(kid.id);
  //   const passedObj = {"id":kid.id,"parentId":parentId, "title":kid.title}; //create a tree node object from a data object 
  //   topic.attachNode(passedObj);
  // })

  // console.log("topic cids")
  // console.log(topic.cids())


  // topic.on().add({id: v4(), title: 'Hello From IDFBINS'})
  // console.log(kids)
  // for (const topicId in resource) {
  //   topic.on(topicId).add({id: v4(), title: 'Hello From IDFBINS'})

    
  //   if (resource[topicId] === 'Computer science') {
  //     // console.log("TOPIC FOUND")
  //     topic
  //       .on(topicId)
  //       .add({id: v4(), title: 'Hello From IDFBINS2'})
  //   }
  // }

  // let pId = computerTopic._parent._initData.parentId;
  // const kId = computerTopic._initData.id;
  
  // console.log("kid1 id is: "+kid1.id+ " title is: "+kid1.title);
  // topic.on(topic.cid(kid1.title)).add({"title":"NODE ATTACH SUCCESSFUL","parentId":parentId})
  // topic.on().add({title:"BOO",customId:"ID1",parentId:topic.cid()});
  // console.log(topic.cids());
  // console.log(topic.on().id)
  // console.log(topic.on(topic.cid(kid1.title)).id)
  topic.processAndAttachImportData();

  // console.log(topic.cid("npm")); //assuming you have added npm as a node on the ui and saved to the backing file.
//  topic.on(topic.cid("npm")).add({title:"run"});
console.log("microsoft object: "+topic.find(topic.cid("Microsoft")).getTitle()+ " "+ topic.find(topic.cid("Microsoft")).getMarkers());
console.log(topic.find(topic.cid("Microsoft"))._data)
  const zip = new Zipper({ path: '/tmp', workbook: loader.getWorkbook() });
  return zip.save().then(status => status && console.info('saved!'));
};

main();