# Designing a Gaze-Based, LLM Driven Keyboard

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Python and Node.js.
- You have a Windows, Linux, or Mac machine.

## Folder Structure

The project is divided into two main parts:

- `diss/KeyboardOptimisation`: The frontend React application.
- `diss/keyboard-app`: The backend Python application.

## Quickstart

This guide will cover setting up your environment to run both the React and Python applications.

### Setting Up the Backend

1. **Configure the Python virtual environment**:

   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows use `myenv\Scripts\activate`
   myenv/bin/pip install -r requirements.txt
   ```

2. **Set up the API Key**:

   - **On MacOS/Linux**:
     ```bash
     export OPENAI_API_KEY='your-api-key-here'
     ```
   - **On Windows**:
     ```cmd
     setx OPENAI_API_KEY "your-api-key-here"
     ```

3. **Run the backend application**:
   ```bash
   myenv/bin/python app.py
   ```

### Setting Up the Frontend

1. **Navigate to the React application directory**:

   ```bash
   cd /KeyboardOptomisation
   ```

2. **Install the dependencies**:

   ```bash
   npm install
   ```

3. **Run the React application**:
   ```bash
   npm start
   ```

### Calibration Process

Upon starting the application, you will be guided through a calibration process. Here's what you need to know:

- **Staring at Dots**: You will see several dots on the screen. Stare at each dot in sequence until the keyboard is fully loaded.
- **Head Movement**: Keep your head as still as possible during the calibration to ensure accuracy.

### Interacting with the Keyboard

To select a button on the keyboard:

- Move the cursor (white arrow) over the button you want to choose.
- Depress the Enter key to select the button.
