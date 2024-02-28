(() => {
  let currentTitle = "";
  let currentChapter = "";

  let currentReadPins = [];
  
  
  const isValidDomain = (url) => {
    const hostname = new URL(url).hostname;
    let a = false;

    if(hostname.includes("shinigami") || hostname.includes("mgkomik")){
      a = true;
    }
    return a;
  }


  if (isValidDomain(window.location.href)) {
    
    const fetchPins = () => {
      return new Promise((resolve) => {
        browser.storage.sync.get([currentTitle], (obj) => {
          resolve(obj[currentTitle] ? JSON.parse(obj[currentTitle]) : []);
        });
      });
    };

    const AddNewPinEventHandler = async () => {
      const timeNow = getTime();
      const newPin = {
        chapter: currentChapter,
        desc: `Last read chapter ${currentChapter} at ${timeNow}`,
      }

      currentReadPins = await fetchPins();


      browser.storage.sync.set({
        [currentTitle]: JSON.stringify([...currentReadPins, newPin].sort((a, b) => a.chapter - b.chapter))
      });
    };

    const newReadLoaded = async () => {

      currentReadPins = await fetchPins();

      const found = currentReadPins.some(a => a.chapter === currentChapter);
      

      if (!found) {
        AddNewPinEventHandler()
      }

    };

    const setReadedContent = async () => {
      currentReadPins = await fetchPins();

      const getLists = document.querySelectorAll('.wp-manga-chapter');

      for (const element of getLists) {
        const getLink = element.querySelector('a');
        const getHref = getLink.getAttribute("href");
        const dataSplit = getHref.split("/");
        const getChapter = dataSplit[5];
        const getNumber = getChapter.split('-')[1];

        const checkFound = currentReadPins.some(a => a.chapter === getNumber);

        if (checkFound) {
          getLink.style.color = "#666";
        }

      }

    }

    browser.runtime.onMessage.addListener((request) => {
      
      const {
        type,
        value,
        title,
        chapter
      } = request;

      if (type === "NEW") {
        currentTitle = title;
        currentChapter = chapter;
        
        newReadLoaded();
      } else if (type === "DELETE") {
        currentReadPins = currentReadPins.filter((b) => b.chapter != value);
        browser.storage.sync.set({
          [currentTitle]: JSON.stringify(currentReadPins)
        });

        response(currentReadPins);
      } else if (type === "SERIES") {
        currentTitle = title;
        setReadedContent();
      }

      return Promise.resolve({ response: "success" });

    });

  }


})();


const getTime = () => {
  return new Date().toLocaleDateString("in-ID");
};