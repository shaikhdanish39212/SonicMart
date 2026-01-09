# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Install MongoDB as a Service" option
4. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

### Alternative: MongoDB with Chocolatey
```bash
choco install mongodb
```

### Alternative: MongoDB with Winget
```bash
winget install MongoDB.Server
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. Create a free account at: https://www.mongodb.com/atlas
2. Create a new cluster (free tier available)
3. Get your connection string
4. Update your `.env` file:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/sounds-accessories
   ```

## Option 3: Docker MongoDB

```bash
docker run --name mongodb -d -p 27017:27017 mongo:latest
```

## Verify Installation

After installation, verify MongoDB is running:

```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# Or try connecting with mongo shell
mongo --version
```

## Seed Database

Once MongoDB is running, seed your database:

```bash
cd backend
npm run seed        # Create sample users and basic products
npm run import      # Import all products from frontend JSON
npm run seed-all    # Run both commands
```

## Default Login Credentials

After seeding:
- **Admin**: admin@soundsaccessories.com / admin123456
- **User**: john@example.com / password123

## Troubleshooting

### MongoDB Connection Issues:
1. Ensure MongoDB service is running
2. Check if port 27017 is available
3. Verify MONGODB_URI in .env file
4. Check firewall settings

### Permission Issues:
- Run command prompt as Administrator
- Check MongoDB data directory permissions

### Alternative Solutions:
- Use MongoDB Atlas (cloud database)
- Use Docker for local development
- Install MongoDB Compass for GUI management
