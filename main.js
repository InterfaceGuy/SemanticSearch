const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('http://localhost:3000');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.handle('save-names', async (event, names) => {
  try {
    await fs.promises.writeFile(path.join(__dirname, 'python', 'names.json'), JSON.stringify(names, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Error saving names:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('run-search', async (event, query) => {
  return new Promise((resolve, reject) => {
    PythonShell.run(
      path.join(__dirname, 'python', 'semantic_search.py'),
      { args: [query] },
      function (err, results) {
        if (err) {
          console.error('Error running Python script:', err);
          reject(err);
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

ipcMain.handle('get-results', async () => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, 'semantic_distances.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading results:', error);
    return { error: error.message };
  }
});
