# API Connections Summary

## Overview
This document outlines the API connections between the frontend Admin UI and the backend Django API for the Seat Predictor application.

## Backend API Endpoints

### Dashboard Analytics
- **GET** `/api/admin/dashboard/stats/` - Basic dashboard statistics
- **GET** `/api/admin/dashboard/comprehensive/` - Comprehensive analytics
- **GET** `/api/admin/dashboard/rank-bands/` - Rank band distribution
- **GET** `/api/admin/dashboard/states/` - State-wise analytics
- **GET** `/api/admin/dashboard/specializations/` - Specialization analytics
- **GET** `/api/admin/dashboard/categories/` - Category analytics
- **GET** `/api/admin/dashboard/courses/` - Course analytics

### Data Upload
- **POST** `/api/admin/upload/enhanced/` - Enhanced file upload with validation
- **GET** `/api/admin/upload/history/` - Upload history
- **GET** `/api/admin/upload/error-reports/{filename}/` - Download error reports

### User Searches
- **GET** `/api/admin/user-searches/enhanced/` - Enhanced user search data with filtering
- **GET** `/api/admin/user-searches/analytics/` - Search analytics
- **POST** `/api/admin/user-searches/export-csv/` - Export filtered data to CSV
- **GET** `/api/admin/user-searches/insights/` - Search insights

### System Settings
- **GET** `/api/admin/settings/` - Get system settings
- **POST** `/api/admin/settings/set-active-year/` - Set active year for exam type
- **POST** `/api/admin/settings/update/` - Update system settings
- **GET** `/api/admin/settings/data-health/` - Data health check
- **GET** `/api/admin/settings/system-status/` - System status

### Authentication
- **POST** `/api/admin/login/` - Admin login
- **POST** `/api/admin/register/` - Admin registration
- **POST** `/api/admin/refresh/` - Refresh JWT token

## Frontend API Integration

### API Client (`lib/api.ts`)
Centralized API client with the following features:
- **ApiClient class**: Handles authentication, headers, and common HTTP methods
- **Specialized API functions**: Organized by feature (dashboard, upload, user searches, settings)
- **Error handling**: Centralized error handling with `handleApiError` utility
- **Type safety**: TypeScript interfaces for API responses

### Connected Components

#### 1. Dashboard (`app/admin/page.tsx`)
- **Connected to**: `dashboardApi.getComprehensive()`
- **Features**: Real-time stats, refresh functionality
- **Data flow**: API → State → UI components

#### 2. Data Upload (`app/admin/data-upload/page.tsx`)
- **Connected to**: 
  - `uploadApi.uploadFile()` - File upload
  - `uploadApi.getHistory()` - Upload history
- **Features**: File validation, error reporting, upload history
- **Data flow**: Form → API → Success/Error feedback

#### 3. User Searches (`app/admin/user-searches/page.tsx`)
- **Connected to**:
  - `userSearchesApi.getEnhanced()` - Search data with filtering
  - `userSearchesApi.exportCsv()` - CSV export
- **Features**: Advanced filtering, pagination, CSV export
- **Data flow**: Filters → API → Table display

#### 4. Settings (`app/admin/settings/page.tsx`)
- **Connected to**:
  - `settingsApi.getSettings()` - Load settings
  - `settingsApi.setActiveYear()` - Set active years
  - `settingsApi.updateSettings()` - Update system settings
- **Features**: Year management, system preferences
- **Data flow**: Settings form → API → Confirmation

## Authentication Flow

### Current Implementation
- API calls include placeholder for JWT authentication
- Authentication headers are commented out but ready for implementation
- Token management through `ApiClient.setToken()`

### Future Implementation
```typescript
// Login flow
const loginData = await authApi.login(username, password);
ApiClient.setToken(loginData.access);
localStorage.setItem('refreshToken', loginData.refresh);

// Automatic token refresh
// Implement token refresh logic in ApiClient
```

## Error Handling

### Backend Error Responses
```json
{
  "error": "Error message",
  "validation_errors": [
    {
      "row": 1,
      "field": "RANK_NO",
      "error": "This field is required"
    }
  ]
}
```

### Frontend Error Handling
- Centralized error handling through `handleApiError()`
- User-friendly error messages
- Fallback to mock data when API fails
- Console logging for debugging

## Data Flow Architecture

```
Frontend Component
    ↓
API Client (lib/api.ts)
    ↓
HTTP Request
    ↓
Django Backend API
    ↓
Database Query
    ↓
Response Processing
    ↓
Frontend State Update
    ↓
UI Re-render
```

## Testing the Connections

### 1. Start Backend Server
```bash
cd seatpredictor-be
python manage.py runserver
```

### 2. Start Frontend Server
```bash
cd seatpredictor-fe
npm run dev
```

### 3. Test API Endpoints
- Dashboard: Navigate to `/admin` - should load real data
- Upload: Try uploading a file - should show validation
- User Searches: Apply filters - should show filtered data
- Settings: Change settings - should save to backend

## Future Enhancements

### 1. Authentication
- Implement JWT token management
- Add login/logout functionality
- Session persistence

### 2. Real-time Updates
- WebSocket connections for live data
- Auto-refresh functionality
- Push notifications

### 3. Advanced Features
- File upload progress tracking
- Bulk operations
- Advanced analytics charts
- Export customization

### 4. Performance
- API response caching
- Pagination optimization
- Lazy loading
- Data compression

## Troubleshooting

### Common Issues
1. **CORS errors**: Ensure CORS is properly configured in Django settings
2. **Authentication errors**: Check JWT token validity
3. **Data not loading**: Verify API endpoints are accessible
4. **Upload failures**: Check file validation rules

### Debug Steps
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check Django server logs
4. Validate data format matches expected schema

## Security Considerations

### Current Security
- CSRF protection disabled for API endpoints
- Input validation on backend
- File type and size validation
- SQL injection protection through Django ORM

### Recommended Security
- Implement proper authentication
- Add rate limiting
- Enable CSRF protection
- Add input sanitization
- Implement audit logging
- Add security headers
