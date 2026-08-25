# 🚀 Schedura — AI-Powered Social Media Automation Platform

Schedura is a **full-stack social media automation platform** that helps users create, manage, schedule, publish, and analyze social media content from a centralized dashboard.

It combines **AI-powered content generation**, **automated scheduling**, **multi-platform publishing**, **cloud-based media management**, and **analytics** into a single workflow.

> **Create → Generate → Upload → Schedule → Publish → Analyze**

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT-based authentication
* Secure user login and registration
* Protected API routes
* Role-based access control
* User-specific content management

### 🤖 AI-Powered Content Creation

Schedura integrates AI services to reduce the time required to create social media content.

* **Gemini API**

  * Automated caption generation
  * AI-assisted content creation

* **Leonardo AI**

  * AI-powered image generation
  * Automated visual content creation

### 📅 Post Scheduling

* Schedule posts for future publication
* Automated background scheduling pipeline
* Asynchronous media processing
* Multi-platform publishing workflow
* Centralized post management

### ☁️ Media Management

Integrated **Cloudinary** for:

* Image uploads
* Cloud storage
* Media optimization
* Asset delivery
* CDN-based media access

### 📊 Analytics Dashboard

The analytics dashboard provides insights into:

* Publishing history
* Engagement trends
* Campaign performance
* Social media activity

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  React Frontend  │
                         └────────┬─────────┘
                                  │
                         REST API │
                                  ▼
                    ┌─────────────────────────┐
                    │   Node.js + Express     │
                    │        Backend          │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        ┌──────────┐       ┌──────────┐      ┌────────────┐
        │ MongoDB  │       │ Gemini   │      │ Leonardo   │
        │ Database │       │   API    │      │    AI      │
        └──────────┘       └──────────┘      └────────────┘
              │
              │
              ▼
        ┌──────────────┐
        │  Cloudinary  │
        │ Media Assets │
        └──────┬───────┘
               │
               ▼
        ┌─────────────────┐
        │ Scheduling /    │
        │ Publishing      │
        │ Pipeline        │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ Social Platforms│
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │    Analytics    │
        │    Dashboard    │
        └─────────────────┘
```

---

# 🔄 Core Workflow

### 1. Create

The user creates a social media post from the Schedura dashboard.

### 2. Generate

AI services can assist with content creation:

```text
User Prompt
    ↓
Gemini API
    ↓
Generated Caption
```

For visual content:

```text
Image Prompt
    ↓
Leonardo AI
    ↓
Generated Image
```

### 3. Upload

Generated or user-provided media is uploaded to Cloudinary.

```text
Frontend
   ↓
Backend
   ↓
Cloudinary
   ↓
Secure Media URL
```

### 4. Schedule

The user selects a date and time for publication.

The backend stores the scheduled post and processes it through the scheduling pipeline.

### 5. Publish

At the scheduled time, the system processes the post and sends the content to the configured social media platforms.

### 6. Analyze

Publishing and engagement data is presented through the analytics dashboard.

---

# 🛠️ Tech Stack

| Category              | Technology   |
| --------------------- | ------------ |
| Frontend              | React.js     |
| Backend               | Node.js      |
| API Framework         | Express.js   |
| Database              | MongoDB      |
| Authentication        | JWT          |
| AI Content Generation | Gemini API   |
| AI Image Generation   | Leonardo AI  |
| Media Storage         | Cloudinary   |
| API Architecture      | RESTful APIs |
| Architecture          | MERN Stack   |

---

# 📁 Project Structure

```text
Schedura/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── README.md
└── package.json
```

> Update the structure above if your actual repository uses different folder names.

---

# 🔑 Authentication Flow

Schedura uses JWT-based authentication.

```text
User Login
    ↓
Express Authentication API
    ↓
Credentials Validation
    ↓
JWT Generated
    ↓
Client Stores Token
    ↓
Authenticated API Requests
    ↓
JWT Middleware
    ↓
Protected Resource
```

Protected routes validate the JWT before allowing access to user-specific resources.

---

# 🧠 AI Content Pipeline

Schedura separates AI generation from the rest of the publishing workflow.

```text
                 User
                  │
                  ▼
             Create Prompt
                  │
          ┌───────┴────────┐
          ▼                ▼
      Gemini API       Leonardo AI
          │                │
          ▼                ▼
       Caption           Image
          │                │
          └───────┬────────┘
                  ▼
              Cloudinary
                  │
                  ▼
             Scheduled Post
```

This separation makes it possible to independently replace or extend AI providers without redesigning the complete application.

---

# 📅 Scheduling Pipeline

One of the core engineering components of Schedura is its scheduled publishing workflow.

```text
Create Post
     ↓
Store Post + Schedule Time
     ↓
Scheduler Checks Pending Posts
     ↓
Is Post Due?
   /       \
 No         Yes
 │           │
Wait      Process Post
             ↓
       Publish to Platform
             ↓
       Update Post Status
             ↓
        Store Results
```

The pipeline is designed around **asynchronous processing**, allowing scheduled publishing to operate independently from the user's frontend session.

---

# 📊 Analytics

The analytics module provides users with a centralized view of their social media activity.

Key metrics include:

* Publishing activity
* Engagement trends
* Post history
* Campaign performance
* Platform activity

The dashboard transforms raw publishing and engagement data into visual insights that can help users evaluate their content strategy.

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone https://github.com/arjxnnagar/Schedura.git

cd Schedura
```

## 2. Install dependencies

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd ../client
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

LEONARDO_API_KEY=your_leonardo_api_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> Never commit your `.env` file or API credentials to GitHub.

---

# ▶️ Running the Application

## Start Backend

```bash
cd server
npm run dev
```

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

The application should then be available through the local development URL shown by Vite.

---

# 🔒 Security Considerations

Schedura implements several security mechanisms:

* JWT-based authentication
* Protected API endpoints
* Role-based authorization
* Environment-based secret management
* Server-side API key handling
* User-specific resource access

API credentials for external services are kept on the backend rather than exposed to the frontend.

---

# 🚀 Future Improvements

Potential future improvements include:

* [ ] Advanced content calendar
* [ ] More social media integrations
* [ ] Automated hashtag generation
* [ ] AI-powered content recommendations
* [ ] Campaign-based content management
* [ ] Advanced analytics and reporting
* [ ] Post-performance prediction
* [ ] Retry and failure handling for publishing jobs
* [ ] Queue-based background workers
* [ ] Email and in-app notifications
* [ ] Team collaboration
* [ ] Subscription and usage management

---

# 🎯 Engineering Highlights

Through Schedura, I worked on:

* Full-stack MERN application architecture
* RESTful API design
* JWT authentication
* Role-based access control
* Third-party API integration
* AI service integration
* Asynchronous workflows
* Scheduled background processing
* Cloud-based media management
* Database modeling
* Dashboard and data visualization
* Multi-platform publishing architecture

The primary engineering challenge was connecting these independent systems into a single reliable workflow:

```text
Authentication
      ↓
Content Creation
      ↓
AI Generation
      ↓
Media Processing
      ↓
Cloud Storage
      ↓
Scheduling
      ↓
Publishing
      ↓
Analytics
```

---

# 👨‍💻 Author

**Arjun Nagar**

Web Developer | Full-Stack Developer

GitHub: [@arjxnnagar](https://github.com/arjxnnagar)

---

# ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub.
