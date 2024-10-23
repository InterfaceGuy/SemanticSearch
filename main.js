const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
let store;
(async () => {
  const { default: Store } = await import('electron-store');
  store = new Store();
})();

let mainWindow;
let pythonPath;

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

app.on('ready', async () => {
  await setupVirtualEnv();
  createWindow();
});

async function setupVirtualEnv() {
  const venvPath = path.join(__dirname, 'venv');
  const venvPythonPath = path.join(venvPath, 'bin', 'python');
  const requirementsPath = path.join(__dirname, 'requirements.txt');

  try {
    // Create virtual environment
    await execPromise(`python3 -m venv ${venvPath}`);
    console.log('Virtual environment created successfully');

    // Upgrade pip
    await execPromise(`${venvPythonPath} -m pip install --upgrade pip`);
    console.log('Pip upgraded successfully');

    // Install requirements
    await execPromise(`${venvPythonPath} -m pip install -r ${requirementsPath}`);
    console.log('Requirements installed successfully');

    pythonPath = venvPythonPath;
  } catch (error) {
    console.error('Error setting up virtual environment:', error);
    app.quit();
  }
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

ipcMain.handle('run-search', async (event, query, directoryPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'python', 'semantic_search.py');
    console.log('Running Python script:', scriptPath);
    console.log('Search query:', query);
    console.log('Directory path:', directoryPath);

    PythonShell.run(
      scriptPath,
      { 
        args: [query, directoryPath],
        pythonPath: pythonPath
      },
      function (err, results) {
        if (err) {
          console.error('Error running Python script:', err);
          console.error('Error details:', JSON.stringify(err, null, 2));
          reject(err);
        } else {
          console.log('Python script results:', results);
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

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths[0];
  }
});

ipcMain.handle('save-directory-path', async (event, directoryPath) => {
  if (store) {
    store.set('directoryPath', directoryPath);
  } else {
    console.error('Store not initialized yet');
  }
});

ipcMain.handle('get-directory-path', async () => {
  if (store) {
    return store.get('directoryPath', '');
  } else {
    console.error('Store not initialized yet');
    return '';
  }
});
