browser.tabs.onUpdated.addListener( async (tabId, tab) => {
  const getUrl = await getTab();
  
  if (tab.status == 'complete' && getUrl.includes("shinigami")) {
    const datas = getUrl.split("/");
    const getTitle = datas[4];
    
    if(getUrl.includes("chapter")){
      const getChapter = datas[5];
      const getNumber = getChapter.split('-')[1];
      
      browser.tabs.sendMessage(tabId, {
        type: "NEW",
        title: getTitle,
        chapter: getNumber
      }).then( response => {
        console.log("Message from the content script:");
      })
      .catch(onError);
    }else if(getUrl.includes("series")){
      browser.tabs.sendMessage(tabId, {
        type: "SERIES",
        title: getTitle
      }).then( response => {
        console.log("Message from the content script:");
      })
      .catch(onError);;

    }
  }
});

function onError(error) {
  console.error(`Error: ${error}`);
}

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await browser.tabs.query(queryOptions);
  return tabs[0] ? tabs[0].url : '';
}