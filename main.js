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

ipcMain.handle('get-results', async (event, maxResults) => {
  try {
    const data = await fs.promises.readFile(path.join(__dirname, 'semantic_distances.json'), 'utf8');
    const results = JSON.parse(data);
    const sortedResults = Object.entries(results)
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxResults);
    return Object.fromEntries(sortedResults);
  } catch (error) {
    console.error('Error reading results:', error);
    return { error: error.message };
  }
});
