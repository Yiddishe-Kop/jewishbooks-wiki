const openLoginWindow = () => {
  const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080#login`
    : `file://${__dirname}/index.html#login`


  const { BrowserWindow } = require('electron').remote;
  const win = new BrowserWindow({
    resizable: false,
    title: 'Login',
    frame: false,
    height: 500,
    width: 400,
    useContentSize: true,
    backgroundColor: '#2d3748',
    titleBarStyle: 'none',
    webPreferences: {
      devTools: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  });

  win.loadURL(winURL);
}

export default openLoginWindow
