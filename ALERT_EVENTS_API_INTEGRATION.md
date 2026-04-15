# Alert Events API Integration

## Overview

The history module has been updated to fetch real alert events from the `/admin/alerts` API endpoint instead of using mock data. The system maintains fallback to mock data if the API fails.

## Files Modified

### 1. **`src/context/services/api/government/history-incidents.ts`**
   - **Changes**: Complete rewrite to fetch from `/admin/alerts` instead of mock data
   - **Key additions**:
     - `AlertEventApiResponse` interface matching API response structure
     - `GetAlertsQueryParams` interface for query parameters
     - `normalizeAlertType()` - Maps API types to IncidentType (supports Vietnamese)
     - `normalizeAlertLevel()` - Maps API severity levels to IncidentSeverity
     - `formatDateToDisplay()` - Converts ISO dates to display format (YYYY-MM-DD HH:mm)
     - `mapAlertEventToIncident()` - Transforms API response to Incident type
   - **Export**: `getGovernmentIncidentHistory(params?: GetAlertsQueryParams): Promise<Incident[]>`

### 2. **`src/app/government/hooks/useHistoryManagement.ts`**
   - **Changes**: Added API data fetching with loading and error states
   - **Key additions**:
     - `useEffect` hook to fetch incidents on component mount
     - Error handling with fallback to mock data
     - New state variables: `incidents`, `loading`, `error`
     - Updated `filteredIncidents` to use fetched data
   - **Exported**: `loading` and `error` states now available to consumers

### 3. **`src/app/government/page/history.tsx`**
   - **Changes**: Added error display and loading state passing
   - **New elements**:
     - Error message display when API fails
     - Pass `loading` prop to HistoryList component

### 4. **`src/app/government/component/HistoryList.tsx`**
   - **Changes**: Added loading state handling and display
   - **Updates**:
     - Added `loading?: boolean` prop
     - Header shows loading spinner when data is being fetched
     - Loading skeleton displayed in the list area when fetching

## Data Mapping

### API Response → Incident Type

| API Field | Incident Field | Transformation |
|-----------|----------------|-----------------|
| `alert_event_id` | `id` | Direct mapping |
| `issue_at` | `time` | Converted from ISO to display format |
| `area_name` | `area` | Direct mapping |
| `name` | `location` | Direct mapping |
| `type` | `type` | Normalized (Flood→flood, Mưa→rain, etc.) |
| `level` | `severity` | Normalized (cao→High, trung bình→Medium, thấp→Low) |
| `scenario_id` | `status` | Mapped (null=Pending, has value=Handled) |
| `description` | `description` | Direct mapping |
| N/A | `actions` | Empty array (not provided by API) |

### Type Normalization

**Alert Types** (supports Vietnamese and English):
- "Flood" or "Ngập" → "flood"
- "Rain" or "Mưa" → "rain"
- "Storm" or "Bão" → "storm"
- "Traffic" or "Giao thông" → "traffic"

**Alert Levels** (supports Vietnamese and English):
- "High" or "Cao" → "High"
- "Medium" or "Trung bình" → "Medium"
- "Low" or "Thấp" → "Low"

## API Endpoint Details

### GET /admin/alerts

Fetches all alert events with optional filtering.

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `type` (optional): Filter by alert type
- `level` (optional): Filter by severity level
- `area_id` (optional): Filter by specific area
- `start_date` (optional): Filter from date (ISO format)
- `end_date` (optional): Filter until date (ISO format)
- `limit` (optional): Max results (default: 100)
- `offset` (optional): Pagination offset (default: 0)

**Response Format**:
```json
[
  {
    "alert_event_id": 1,
    "name": "Heavy Flooding in District 1",
    "type": "Flood",
    "description": "Water level rising rapidly",
    "issue_at": "2024-01-15T09:30:00Z",
    "area_id": 1,
    "area_name": "District 1",
    "scenario_id": null,
    "level": "High",
    "user_id": 5,
    "UserAccount": {...},
    "ResponseScenario": null
  }
]
```

## Configuration

### Environment Setup

The API client uses `NEXT_PUBLIC_API_URL` environment variable:

```env
# .env (existing)
NEXT_PUBLIC_API_URL=http://localhost:3000/api  # or your API server
```

**Default**: `http://localhost:3000/api` if not set

### Authentication

The API client automatically includes Bearer token from localStorage:

```javascript
// From src/services/api-config.ts
const token = localStorage.getItem('accessToken');
// Automatically added as: Authorization: Bearer <token>
```

Ensure the `accessToken` is stored in localStorage after login.

## Data Flow

```
1. AdminHistory page mounts
   ↓
2. useHistoryManagement hook initializes
   ↓
3. useEffect fetches from /admin/alerts
   ↓
4. getGovernmentIncidentHistory() called
   ↓
5. API response mapped to Incident[]
   ↓
6. incidents state updated
   ↓
7. HistoryList renders with real data
   ↓
8. User can filter, select, and view incident details
```

## Error Handling

The system includes comprehensive error handling:

1. **API Fetch Error**: Falls back to mock data and displays error message
2. **Type Conversion Error**: Uses sensible defaults for normalization
3. **Date Format Error**: Falls back to current date format
4. **Loading State**: Shows spinner while fetching

## Usage Examples

### Fetch All Alerts
```javascript
const incidents = await getGovernmentIncidentHistory();
```

### Fetch with Filters
```javascript
const incidents = await getGovernmentIncidentHistory({
  type: 'Flood',
  level: 'High',
  area_id: 1,
  limit: 50,
  offset: 0
});
```

### In Component
```javascript
const { 
  filteredIncidents, 
  loading, 
  error 
} = useHistoryManagement();

return (
  <>
    {error && <ErrorDisplay message={error} />}
    {loading && <LoadingSpinner />}
    <HistoryList 
      incidents={filteredIncidents}
      loading={loading}
      {...otherProps}
    />
  </>
);
```

## Fallback Mechanism

If the API is unavailable or fails:

1. Error is logged to console
2. Error state is set for UI display
3. Mock data (`INCIDENTS` from `src/context/services/mock/government/history-incidents.ts`) is used
4. Application continues to function normally

This ensures the application remains usable even if the API is temporarily down.

## Testing the Integration

1. **Ensure API is running** on `http://localhost:3000`
2. **Set valid access token** in localStorage
3. **Navigate to history page** - Should fetch and display real alerts
4. **Check browser console** for any error messages
5. **Use DevTools Network tab** to inspect `/admin/alerts` requests

## Security Considerations

- ✅ Bearer token automatically injected from localStorage
- ✅ Requires authentication (401 Unauthorized if no token)
- ✅ CORS headers must be configured on backend
- ✅ All filtering parameters server-side validated

## Future Enhancements

- Add caching layer to reduce API calls
- Implement real-time updates with WebSocket
- Add client-side filtering optimization
- Pagination support for large datasets
- Export/download alert history
