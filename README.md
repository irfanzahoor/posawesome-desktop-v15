**POS Desktop Application built with Electron and Frappe Bench**

---

## Overview

POS Desktop App ek lightweight aur powerful Point of Sale desktop application hai jo Electron framework par bana hua hai. Ye app Frappe Bench aur ERPNext backend ke saath integrate hota hai taake aap apne POS operations ko efficiently manage kar sakein.

---

## Features

- Electron-based desktop application with native tray icon support  
- Auto-launch on system startup  
- Integrated with Frappe Bench backend  
- Multi-platform support: Windows, macOS, Linux  
- Easy configuration for frappe-bench folder  
- User-friendly tray menu for quick access  
- Automatic detection when Frappe server is ready  
- Customizable app settings via tray menu

---

## Requirements

Before using POS Desktop App, please make sure you have the following installed and configured on your system:

- **Frappe Framework** — backend framework  
- **ERPNext** — ERP system for POS and backend data  
- **Frappe Bench** — to run frappe and erpnext locally  
- **Posawesome** — to run posawesome 
- **Node.js** and **npm** (for building and running Electron app)  
- **Git** (optional, for cloning the repo)

---

## Installation

1. **Clone the repository** (or download source):

   ```bash
   git clone git@github.com:irfanzahoor/posawesome-desktop-v15.git
   cd electron
````

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Select your Frappe Bench folder:**

   * On first launch, the app will prompt you to select your frappe-bench directory.
   * This path will be saved in app config automatically.

4. **Run the app:**

   ```bash
   npm start
   ```

---

## Running the App

* The app will automatically start the `bench start` process for your selected frappe-bench directory.
* It waits until the Frappe server is fully ready (default `http://127.0.0.1:8001`), then opens the POS interface.
* The app minimizes to tray instead of closing, so you can keep it running in the background.
* Use tray icon menu for showing the app, accessing settings, or quitting.

---

## Building the App

You can build the app for different platforms using:

* **Windows build:**

  ```bash
  npm run build:win
  ```

* **macOS build:**

  ```bash
  npm run build:mac
  ```

* **Linux build:**

  ```bash
  npm run build:linux
  ```

* **Build all platforms (if supported):**

  ```bash
  npm run build
  ```

**Note:**

* Mac build requires macOS system with Apple signing certificates (optional).
* Linux build may require packaging tools installed (`dpkg` for `.deb`).
* Cross-platform building may have limitations.

---

## Configuration

* Config file is stored in your user data folder as `config.json`.
* To change frappe-bench directory, delete or edit this config file and restart the app.

---

## Troubleshooting

* **Bench process exits immediately:**
  Make sure your frappe-bench is properly set up and all services are working. You can try running `bench start` manually in your bench directory to check.

* **App not connecting to Frappe server:**
  Verify that the Frappe server is running on `http://127.0.0.1:8001`. If your server uses a different port, update the URL in `main.js`.

* **Tray icon or menu not showing:**
  Restart the app. Some Linux desktop environments have specific tray icon support issues.

* **App crashes on startup:**
  Check the console output for errors and ensure you have latest Node.js and npm installed.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for bug fixes and new features.

---

## License

MIT License © 2025 Codeboy

---

## Contact

For questions or support, contact:
**[codeboy@example.com](mailto:codeboy@example.com)**

---

**Thank you for using POS Desktop App!**
Built with ❤️ using Electron and Frappe.

```
