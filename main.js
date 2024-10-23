const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

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

ipcMain.handle('run-command', async (event, command) => {
  return new Promise((resolve, reject) => {
    const fullCommand = command.replace(/^python/, pythonPath);
    const options = {
      env: { ...process.env, PYTHONPATH: path.dirname(pythonPath) }
    };
    exec(fullCommand, options, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve(stdout);
    });
  });
});

ipcMain.handle('read-file', async (event, filePath) => {
  return await fs.readFile(filePath, 'utf8');
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  await fs.writeFile(filePath, content, 'utf8');
  return true;
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
