import { ipcRenderer } from 'electron';

const openLoginWindow = () => {
  ipcRenderer.send('open-login-window');
};

export default openLoginWindow;
