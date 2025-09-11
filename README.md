

To get started, take a look at src/app/page.tsx.

## Running Locally (Offline Development)

To run this project on your local machine, you'll need to have Node.js (v20 or later) and npm installed.

### 1. Environment Setup

Before running the application, you need to set up your environment variables. This project uses a `.env` file to manage API keys and other secrets.

1.  **Create a `.env` file** in the root of the project.
2.  **Add your Gemini API key** to the file. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```
GEMINI_API_KEY="YOUR_API_KEY"
```

### 2. Install Dependencies

First, navigate to the project's root directory in your terminal and install the necessary packages:

```bash
npm install
```

### 3. Running in VS Code

For the best experience, we recommend using Visual Studio Code.

1.  **Open the project** in VS Code.
2.  **Open the Integrated Terminal** (you can use the shortcut `Ctrl+` \` ``).
3.  **Split the terminal** to have two separate terminal instances side-by-side. You can do this by clicking the "Split Terminal" icon in the terminal panel.
4.  In the **first terminal**, start the Next.js development server:

    ```bash
    npm run dev
    ```

    This will start the main application. You can view it in your browser at `http://localhost:9002`.

5.  In the **second terminal**, start the Genkit AI server:

    ```bash
    npm run genkit:dev
    ```

    This starts the local server for the AI flows, which the Next.js app will call.

With both servers running, the application will be fully functional on your local machine.

### 4. Running with Other Editors

If you are not using VS Code, you can run the project by opening two separate terminal windows.

**Terminal 1: Start the Next.js App**

```bash
npm run dev
```

**Terminal 2: Start the Genkit AI Server**

```bash
npm run genkit:dev
```
