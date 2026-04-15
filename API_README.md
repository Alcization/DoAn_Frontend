# SWTIS API Documentation

This document provides a comprehensive overview of the APIs used in the SWTIS Frontend application. The APIs are divided into internal Next.js proxy routes (primarily for Vietmap services) and core backend services.

---

## 1. Internal Proxy APIs (Vietmap)

These APIs are defined within the frontend to proxy requests to Vietmap's official services, handling API key injection and CORS issues.

### **Vietmap Autocomplete**
- **File Path**: `src/app/api/vietmap-autocomplete/route.ts`
- **Purpose**: Provides location suggestions as the user types.
- **URL**: `/api/vietmap-autocomplete`
- **Method**: `GET`
- **UI Usage**:
  - `LocationInputs.tsx` (Search bar in map pages)
  - `CurrentWeatherCard.tsx` (Location search for weather)
  - `LocationSelector.tsx` (Origin/Destination picking)
  - `MapFullSidebar.tsx` (Side panel search)
- **Request Parameters**:
  - `text` (required): Search string.
  - `focus` (optional): `lat,lng` to prioritize results near a location.
  - `display_type` (optional): Default is `5`.
- **Response**: Array of suggestion objects containing `ref_id`, `address`, and `name`.

### **Vietmap Place Details**
- **File Path**: `src/app/api/vietmap-place/route.ts`
- **Purpose**: Retrieves detailed coordinates and information for a specific place using a `ref_id`.
- **URL**: `/api/vietmap-place`
- **Method**: `GET`
- **UI Usage**:
  - `LocationInputs.tsx` (Resolving search selection)
  - `CurrentWeatherCard.tsx` (Resolving weather location)
  - `LocationSelector.tsx` (Resolving route points)
  - `MapFullSidebar.tsx` (Resolving markers)
- **Request Parameters**:
  - `refid` (required): The unique reference ID from autocomplete.
- **Response**: Detailed place object containing `lat`, `lng`, and full address.

### **Vietmap Reverse Geocoding**
- **File Path**: `src/app/api/vietmap-reverse/route.ts`
- **Purpose**: Converts coordinates (`lat`, `lng`) into a human-readable address.
- **URL**: `/api/vietmap-reverse`
- **Method**: `GET`
- **UI Usage**:
  - `CurrentWeatherCard.tsx` (Address lookup for map click/marker drag)
  - `LocationSelector.tsx` (Address lookup for manual point selection)
- **Request Parameters**:
  - `lat`, `lng` (required): Coordinates to resolve.
- **Response**: Address object for the specified location.

### **Vietmap Routing**
- **File Path**: `src/app/api/vietmap-route/route.ts`
- **Purpose**: Calculates the optimal route between two or more points.
- **URL**: `/api/vietmap-route`
- **Method**: `GET`
- **UI Usage**:
  - `LocationInputs.tsx` (Calculating path for map preview)
  - `LocationSelector.tsx` (Main routing logic)
  - `map_full/page.tsx` (Full map routing view)
- **Request Parameters**:
  - `point` (required, multiple): Coordinates in `lat,lng` format (at least two points).
  - `vehicle` (optional): `car`, `bike`, etc. (default `car`).
  - `points_encoded` (optional): Default `true`.
- **Response**: Route data including `LineString` geometry and navigation instructions.

### **Vietmap Search**
- **File Path**: `src/app/api/vietmap-search/route.ts`
- **Purpose**: Performs a direct search for places.
- **URL**: `/api/vietmap-search`
- **Method**: `GET`
- **Request Parameters**:
  - `text` (required): Search query.
- **Response**: List of matching places.

---

## 2. Core Backend Services

All backend service calls are centralized in `src/api/api-client.ts`, which is generated via Swagger. The base URL is `http://localhost:3000/api`.

### **Authentication (`/auth`)**
- **Endpoints**:
  - `POST /auth/signup` - Register new user.
  - `POST /auth/signin` - Login with credentials.
- **UI Usage**:
  - `LoginModal.tsx` / `SignupModal.tsx` (Internal logic for user access).

### **Map & Real-time Data (`/map`)**
- **Endpoints**:
  - `GET /map/traffic` - Retrieve real-time traffic GeoJSON data.
  - `GET /map/weather-areas` - Get polygons of weather-affected zones.
  - `GET /map/incidents` - Get reports of accidents/floods.
- **UI Usage**:
  - `VietMap.tsx` (Renders GeoJSON layers for traffic/weather).
  - `IncidentMap.tsx` (Displays incident markers, currently using mock data from `history-incidents.ts`).

### **Analysis & Predictions (`/analysis`)**
- **Endpoints**:
  - `GET /analysis/forecast` - Get weather forecast for coordinates.
  - `POST /analysis/assess-risk` - Evaluate trip safety.
- **UI Usage**:
  - `CurrentWeatherCard.tsx` (Displays weather data).
  - `WeatherForecast.tsx` (Detailed forecast view).
  - `RouteSafetyPanel.tsx` (Risk assessment feedback).

### **Saved Routes & Locations (`/routes`)**
- **Endpoints**:
  - `GET/POST /routes/locations` - Manage user's favorite places.
  - `GET/POST /routes` - Save and retrieve planned routes.
- **UI Usage**:
  - `FavoritePlaces.tsx` (User's saved locations).
  - `PersonalFavRoutes.tsx` (Saved routes list).
  - `EditLocationModal.tsx` (Interface for updating saved items).

### **Admin Functions (`/admin`)**
- **Endpoints**:
  - `GET/POST/PUT/DELETE /admin/areas` - Manage administrative boundaries.
  - `GET /admin/dashboard` - Global system statistics.
- **UI Usage**:
  - `AreaTable.tsx` / `AreaForm.tsx` (Admin area management).
  - `KPIStats.tsx` / `ChartsView.tsx` (Admin dashboard visualization).

---

## 3. Data Flow Summary

| Data Type | Primary UI Component | API / Data Source |
| :--- | :--- | :--- |
| **Location Search** | `LocationInputs.tsx` | `/api/vietmap-autocomplete` |
| **Map Display** | `VietMap.tsx` | Vietmap Tiles + `/api/map/traffic` |
| **Weather Status** | `CurrentWeatherCard.tsx` | `/api/analysis/forecast` |
| **Routing** | `LocationSelector.tsx` | `/api/vietmap-route` |
| **Admin Stats** | `ChartsView.tsx` | `/api/admin/dashboard` |

---

## 4. Environment Dependencies

The following variables must be configured in `.env.local`:
- `NEXT_PUBLIC_VIETMAP_API_KEY`: Required for all Vietmap proxy calls.
- `NEXT_PUBLIC_API_URL`: Base URL for the Core Backend (typically `http://localhost:3000/api`).
