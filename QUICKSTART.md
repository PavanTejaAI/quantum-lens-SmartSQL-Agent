# 🚀 Quick Start Guide

Get the Quantum Lens SmartSQL automation tool running in under 10 minutes!

## 📋 **Prerequisites Checklist**

Before starting, ensure you have:
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed  
- [ ] MySQL 5.7+ running
- [ ] OpenRouter account ([Sign up here](https://openrouter.ai/))

## ⚡ **5-Minute Setup**

### **Step 1: Clone and Navigate**
```bash
git clone https://github.com/quantum-lens/quantum-lens-SmartSQL-Agent
cd quantum-lens-SmartSQL-Agent
```

### **Step 2: Database Setup**
```sql
-- Connect to MySQL and create database
mysql -u root -p
CREATE DATABASE quantum_lens;
EXIT;
```

### **Step 3: Backend Configuration**
```bash
cd quantum-lens-backend

# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### **Step 4: Environment Variables**
Create `.env` file in `quantum-lens-backend/`:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=quantum_lens

# Security
JWT_SECRET=your_super_secure_secret_key_here

# AI Integration  
OPENROUTER_API_KEY=your_openrouter_api_key
SITE_URL=http://localhost:3000
SITE_NAME=Quantum Lens SmartSQL Agent
```

### **Step 5: Initialize Database**
```bash
python -c "from src.service.auth.auth_service import AuthService; from src.service.projects.project_service import ProjectService; AuthService.init_db(); ProjectService.init_db()"
```

### **Step 6: Start Backend**
```bash
uvicorn src.main:app --port 5000 --reload
```

### **Step 7: Frontend Setup** (New Terminal)
```bash
cd quantum-lens-frontend
npm install
npm start
```

## 🎉 **Access Your Application**

- **Main App**: http://localhost:3000
- **API Docs**: http://localhost:5000/docs
- **Backend**: http://localhost:5000

## 🔑 **Getting Your OpenRouter API Key**

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [API Keys section](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the key to your `.env` file

## 📝 **First Steps**

1. **Create Account**: Set up your account at http://localhost:3000/register
2. **Connect Database**: Add your database project and configure connection
3. **Start Automating**: Try natural language queries like "What tables do I have?"
4. **Explore Features**: Use the AI-powered automation capabilities for your database operations

## 🛠 **Troubleshooting**

### **Common Issues**

**Database Connection Failed**
```bash
# Check MySQL is running
mysqladmin ping

# Verify credentials
mysql -u root -p -e "SELECT 1"
```

**OpenRouter API Errors**
- Verify API key is correct
- Check account has available credits
- Ensure internet connection is stable

**Port Already in Use**
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

**Python Module Not Found**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

## 🔄 **Development Workflow**

### **Backend Development**
```bash
# Auto-reload on changes
uvicorn src.main:app --port 5000 --reload

# Run tests
python -m pytest

# Check code style
flake8 src/
```

### **Frontend Development**
```bash
# Development server with hot reload
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 📞 **Need Help?**

- 📚 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/quantum-lens/issues)
- 💬 [Community Discussions](https://github.com/quantum-lens/discussions)
- 📧 [Email Support](mailto:support@quantumlens.ai)

---

**Happy Automating! 🚀** 