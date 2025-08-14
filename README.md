# tinqs — Frontend (React)

## Description
This is the **frontend** of the tinqs MERN app.  
It’s built with React and talks to the backend API.

 The backend repository can be found here:  
https://github.com/logicness-agency/project-3-backend

## How to run this project locally

### 1. Clone this repo
```bash
git clone https://github.com/logicness-agency/project-3-frontend.git
cd project-3-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a file called **`.env`** in the root of the frontend folder.  
Add the following (replace with your own values if needed):

```
REACT_APP_API_URL=http://localhost:5005/api
```

> This is the URL where your backend API runs locally.  
> If your backend is deployed, replace it with the live API URL.

### 4. Start the app
```bash
npm start
```
By default, the app will open at:  
http://localhost:3000

## Demo
Live frontend: https://tinqs.netlify.app/
