browser.tabs.onUpdated.addListener(async (tabId, tab) => {
  const getUrl = await getTab();

  if (tab.status == 'complete') {
    
    if (getUrl.includes("shinigami") || getUrl.includes("mgkomik")) {

      const datas = getUrl.split("/");
      const getTitle = datas[4];

      if (getUrl.includes("chapter")) {
        const getChapter = datas[5];
        const getNumber = getChapter.split('-')[1];

        browser.tabs.sendMessage(tabId, {
            type: "NEW",
            title: getTitle,
            chapter: getNumber
          }).then(response => {
            
          })
          .catch(onError);
      } else if (getUrl.includes("series") || getUrl.includes("komik")) {
        browser.tabs.sendMessage(tabId, {
            type: "SERIES",
            title: getTitle
          }).then(response => {
            
            
          })
          .catch(onError);;

      }

    }
  }
});

function onError(error) {
  console.error(`Error: ${error}`);
}

async function getTab() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let tabs = await browser.tabs.query(queryOptions);
  return tabs[0] ? tabs[0].url : '';
}