# QuantumCommerce

A modern, full-stack e-commerce platform built with cutting-edge web technologies, demonstrating production-ready deployment practices and microservices architecture.

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **GraphQL Client:** Apollo Client
- **State Management:** React Context API
- **Deployment:** Vercel, AWS EC2
- **Features:** Server Components, Client Components, Protected Routes

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **API:** GraphQL with Apollo Server
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Containerization:** Docker
- **Deployment:** AWS EC2 (Ubuntu)
- **Domain & SSL:** Cloudflare (Flexible SSL)

## 🏗️ Architecture
```
┌─────────────────┐         HTTPS          ┌──────────────────┐
│   Vercel        │ ───────────────────────▶│   Cloudflare     │
│   (Frontend)    │                         │   SSL Proxy      │
└─────────────────┘                         └──────────────────┘
                                                     │
                                                     │ HTTP
                                                     ▼
                                            ┌──────────────────┐
                                            │   AWS EC2        │
                                            │   Docker         │
                                            │   (Backend)      │
                                            └──────────────────┘
                                                     │
                                                     │
                                                     ▼
                                            ┌──────────────────┐
                                            │  MongoDB Atlas   │
                                            │  (Database)      │
                                            └──────────────────┘
```

## ✨ Features

### Implemented
- ✅ User Authentication (Signup/Login)
- ✅ JWT-based Session Management
- ✅ Product Catalog with GraphQL Queries
- ✅ Protected Routes (Client-side)
- ✅ Cross-Origin Resource Sharing (CORS)
- ✅ Responsive UI with Tailwind CSS
- ✅ Docker Containerization
- ✅ Automated Deployment Scripts
- ✅ Production-Ready HTTPS Setup

### In Progress
- 🚧 Shopping Cart Functionality
- 🚧 Rate Limiting for Authentication
- 🚧 Order Management

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- Docker
- MongoDB Atlas account

### Frontend Setup
```bash
cd frontend/quantumcommerce-frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

Run development server:
```bash
npm run dev
```

### Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGODB_URI=your_mongodb_uri
DB_NAME=quantumcommerce
JWT_SECRET=your_jwt_secret
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-vercel-app.vercel.app
```

Run development server:
```bash
npm run dev
```

## 🚢 Deployment

### Frontend (Vercel)
- Connected to GitHub repository
- Automatic deployments on push to main
- Environment variables configured in Vercel dashboard

### Backend (AWS EC2)

**Build and push Docker image:**
```bash
./build-and-push.sh <version>
```

**Deploy to EC2:**
```bash
ssh into EC2
./deploy.sh <version>
```

## 🔐 Security Features

- JWT token authentication
- CORS configuration for trusted origins
- Session-based credential management
- CSRF protection (Apollo Server)
- Cloudflare SSL/TLS encryption
- Environment-based secrets management

## 📝 API Endpoints

**GraphQL Endpoint:** `https://quantumapi.sarkars.shop/graphql`

### Queries
- `products` - Fetch all products
- `product(id: ID!)` - Fetch single product

### Mutations
- `register(input: RegisterInput!)` - Create new user account
- `login(input: LoginInput!)` - Authenticate user

## 🌐 Live URLs

- **Frontend:** https://quantum-commerce-pi.vercel.app
- **Backend API:** https://quantumapi.sarkars.shop/graphql

## 📚 Learning Outcomes

This project demonstrates:
- Microservices architecture with separate frontend/backend deployments
- GraphQL API design and implementation
- Docker containerization and deployment workflows
- Cloud infrastructure (AWS EC2, Vercel)
- DNS management and SSL certificate setup
- Cross-origin authentication patterns
- Modern React patterns (Server/Client Components, Context API)
- Production-ready deployment practices

## 🔮 Future Enhancements

- [ ] Shopping cart with real-time updates
- [ ] Payment gateway integration
- [ ] Product search and filtering
- [ ] User profile management
- [ ] Order history and tracking
- [ ] Admin dashboard
- [ ] Rate limiting and security hardening
- [ ] Redis caching layer
- [ ] CI/CD pipeline with GitHub Actions

## 👨‍💻 Developer

Built by **Akshay Sarkar** as a comprehensive learning project for modern web development and cloud deployment.

---

**License:** MIT
