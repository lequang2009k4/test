# SmartAir City - Frontend

Interactive web dashboard for real-time air quality monitoring with maps and data visualization.

## Technology Stack

- React 19.2.0
- Leaflet.js for interactive maps
- Chart.js for data visualization
- Axios for API communication

## Prerequisites

- Node.js 16.x or later
- npm or yarn package manager

For Docker deployment:
- Docker 20.10+
- Docker Compose 2.0+

## Development Setup

### Standard Development

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Application will be available at `http://localhost:3000`.

### Docker Development

```bash
# Run with Docker Compose
docker-compose up --build
```

Application will be available at `http://localhost:3000`.

## Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=10000
REACT_APP_MAP_CENTER_LAT=21.0285
REACT_APP_MAP_CENTER_LNG=105.8542
REACT_APP_MAP_DEFAULT_ZOOM=12
```

**Important:** Never commit `.env` files containing sensitive information. Use `.env.example` as a template.

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder with optimized React bundles.

## Docker Deployment

### Production Build

```bash
# Build and run with Docker Compose
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Dockerfile Overview

The production Dockerfile uses multi-stage builds:
1. **Build stage**: Compiles React application using Node.js
2. **Serve stage**: Serves static files using Nginx

### Custom Nginx Configuration

The `nginx.conf` file includes:
- React Router support (SPA routing)
- Gzip compression
- Security headers
- Static asset caching
- Health check endpoint at `/health`

## Project Structure

```
frontend/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── About.js
│   │   ├── AirQualityChart.js
│   │   ├── AirQualityMap.js
│   │   ├── AlertBanner.js
│   │   ├── APIDataViewer.js
│   │   ├── ErrorMessage.js
│   │   ├── Footer.js
│   │   ├── Header.js
│   │   ├── LoadingSpinner.js
│   │   ├── SearchFilter.js
│   │   ├── StationComparisonChart.js
│   │   └── StatsCards.js
│   ├── data/             # Mock data and utilities
│   ├── utils/            # Helper functions
│   ├── App.js            # Main application component
│   └── index.js          # Application entry point
├── .dockerignore         # Docker build exclusions
├── .env.example          # Environment variables template
├── Dockerfile            # Production Docker image
├── docker-compose.yml    # Docker orchestration
└── nginx.conf           # Nginx configuration
```

## Building for Production

### Without Docker

```bash
npm run build
```

Outputs to `build/` directory ready for deployment.

### With Docker

```bash
docker build -t smartair-frontend .
docker run -p 3000:80 smartair-frontend
```

## Deployment

### Server Requirements

- Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- 1GB RAM minimum (2GB+ recommended)
- Docker and Docker Compose installed

### Deployment Steps

1. Clone repository:
```bash
git clone https://github.com/lequang2009k4/SmartAir-City.git
cd SmartAir-City/frontend
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with production values
```

3. Deploy with Docker:
```bash
docker-compose up -d --build
```

### Updating Deployed Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Clean old images
docker image prune -f
```

## Troubleshooting

### Build Errors

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For Docker, rebuild without cache
docker-compose build --no-cache
```

### Port Already in Use

```bash
# Check what's using port 3000
# Windows PowerShell:
netstat -ano | findstr :3000

# Linux/Mac:
lsof -i :3000

# Change port in docker-compose.yml:
ports:
  - "3001:80"  # Use different port
```

### Container Health Check Failed

```bash
# Check container logs
docker-compose logs frontend

# Check container status
docker-compose ps

# Restart container
docker-compose restart frontend
```

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
