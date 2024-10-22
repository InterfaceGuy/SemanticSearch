# Electron + React + Python Semantic Search Project Plan

## Objective
Convert the existing semantic search Python project into an Electron application with a React frontend, using IPC for communication between the frontend and backend.

## Steps

1. Set up Electron project structure
   - Create main Electron process file
   - Set up IPC handlers in the main process
   - Adjust React frontend to work within Electron

2. Modify Python script
   - Update `semantic_search.py` to accept command-line arguments for the search query

3. Implement IPC handlers
   - Handler to write names to `names.json`
   - Handler to run the Python script with a search query
   - Handler to read results from `semantic_distances.json`

4. Update React components
   - Add functionality to input and save custom names
   - Implement search functionality using IPC
   - Display search results from `semantic_distances.json`

5. Package the application
   - Set up build process for Electron app
   - Ensure Python environment is properly bundled

## File Structure
```
project_root/
├── public/
│   └── index.html
├── src/
│   ├── App.js
│   ├── LoadingScreen.js
│   ├── SearchComponent.js
│   └── index.js
├── python/
│   ├── semantic_search.py
│   └── names.json
├── main.js
├── package.json
└── semantic_distances.json
```

## Implementation Details

- Use `electron-builder` for packaging the application
- Use `python-shell` for running Python scripts from Electron
- Ensure proper error handling and loading states in the UI
- Implement file system operations using Node.js `fs` module

## Next Steps

1. Set up the Electron project structure
2. Modify the Python script
3. Implement IPC handlers
4. Update React components
5. Test the integration
6. Package the application
