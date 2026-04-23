# Tong hop trang va API can lay du lieu

Tai lieu nay liệt kê theo tung route/trang dang co trong `src/app`, bao gom ca cac tab noi bo (government/personal/business).

## 1) Auth

### `/`

- Page: `src/app/page.tsx`
- API: Khong co (chi redirect sang `/auth/login`).

### `/auth/login`

- Page: `src/app/auth/login/page.tsx`
- API:
  - `POST ${API_BASE_URL}/auth/signin`
- Gọi tại:
  - `src/app/auth/hooks/useLoginForm.ts`

### `/auth/signup`

- Page: `src/app/auth/signup/page.tsx`
- API:
  - `POST ${API_BASE_URL}/auth/signup`
- Gọi tại:
  - `src/app/auth/hooks/useSignupForm.ts`

### `/auth/verify-email`

- Page: `src/app/auth/verify-email/page.tsx`
- API:
  - `POST ${API_BASE_URL}/auth/send-otp`
  - `POST ${API_BASE_URL}/auth/verify-otp`
- Gọi tại:
  - `src/app/auth/hooks/useVerifyEmail.ts`

### `/auth/new-password`

- Page: `src/app/auth/new-password/page.tsx`
- API:
  - `POST ${API_BASE_URL}/auth/reset-password`
- Gọi tại:
  - `src/app/auth/hooks/useNewPassword.ts`

---

## 2) Government (`/government/page?tab=...`)

### `tab=dashboard`

- Page: `src/app/government/page/dashboard.tsx`
- API backend:
  - `GET ${API_BASE_URL}/admin/areas`
  - `GET ${API_BASE_URL}/admin/alerts`
  - Fallback: `GET ${API_BASE_URL}/government/dashboard-summary`
- API external weather (qua shared service):
  - `GET https://api.openweathermap.org/geo/1.0/direct`
  - `GET https://api.openweathermap.org/data/2.5/forecast`
  - `GET https://api.openweathermap.org/data/2.5/weather`
  - `GET https://history.openweathermap.org/data/2.5/history/city`
- Gọi tại:
  - `src/app/government/hooks/useDashboard.ts`
  - `src/context/services/api/government/history-incidents.ts`
  - `src/context/services/api/government/dashboard.ts`
  - `src/context/services/api/shared/weather.ts`

### `tab=area-management`

- Page: `src/app/government/page/area-management.tsx`
- API:
  - `GET ${API_BASE_URL}/admin/areas`
  - `POST ${API_BASE_URL}/admin/areas`
  - `PUT ${API_BASE_URL}/admin/areas/{areaId}`
  - `DELETE ${API_BASE_URL}/admin/areas/{areaId}`
- Gọi tại:
  - `src/app/government/component/area-logic/useAreaTable.ts`

### `tab=history`

- Page: `src/app/government/page/history.tsx`
- API:
  - `GET ${API_BASE_URL}/admin/alerts`
  - `PUT ${API_BASE_URL}/admin/alerts/{alertEventId}` (khi gan scenario)
  - `GET ${API_BASE_URL}/response-scenarios?scenario_id={id}` (load chi tiet scenario da kich hoat)
- Gọi tại:
  - `src/app/government/hooks/useHistoryManagement.ts`
  - `src/context/services/api/government/history-incidents.ts`
  - `src/app/government/component/HistoryDetail.tsx`
  - `src/context/services/api/government/scenario-management.ts`

### `tab=scenario-management`

- Page: `src/app/government/page/scenario-management.tsx`
- API:
  - `GET ${API_BASE_URL}/response-scenarios`
  - `POST ${API_BASE_URL}/response-scenarios`
  - `PUT ${API_BASE_URL}/response-scenarios/{id}`
  - `DELETE ${API_BASE_URL}/response-scenarios/{id}`
  - (co endpoint cu fallback/mock): `GET ${API_BASE_URL}/government/scenarios`
- Gọi tại:
  - `src/app/government/hooks/useScenarioManagement.ts`
  - `src/context/services/api/government/scenario-management.ts`

### `tab=reports`

- Page: `src/app/government/page/reports.tsx`
- API:
  - `GET ${API_BASE_URL}/users/me/report-schedules`
  - `POST ${API_BASE_URL}/users/me/report-schedules`
  - (service cu fallback/mock):
    - `GET ${API_BASE_URL}/government/reports/history`
    - `GET ${API_BASE_URL}/government/reports/topics`
- Gọi tại:
  - `src/app/government/hooks/useReportManagement.ts`
  - `src/context/services/api/government/reports.ts`

---

## 3) Normal Personal (`/normal/personal/page?tab=...`)

### `tab=home`

- Page: `src/app/normal/page/home.tsx`
- API:
  - `GET https://api.openweathermap.org/data/2.5/weather`
  - `POST ${API_BASE_URL}/routes/weather-history`
  - `GET ${API_BASE_URL}/routes/locations`
  - `GET ${API_BASE_URL}/routes`
  - `POST ${API_BASE_URL}/routes/locations` (them dia diem yeu thich)
  - `POST ${API_BASE_URL}/routes` (them tuyen duong yeu thich khi mode business)
  - Noi bo Vietmap API:
    - `GET /api/vietmap-autocomplete`
    - `GET /api/vietmap-place`
    - `GET /api/vietmap-reverse`
  - `GET https://api.openweathermap.org/data/2.5/weather` (cho tung item yeu thich)
- Gọi tại:
  - `src/app/normal/shared_component/CurrentWeatherCard.tsx`
  - `src/app/normal/shared_component/FavoritePlaces.tsx`
  - `src/app/normal/shared_component/FavoritePlaceItem.tsx`
  - `src/app/normal/hooks/useVietmapFacade.ts`

### `tab=weather`

- Page: `src/app/normal/page/weather.tsx`
- API:
  - `GET https://api.openweathermap.org/data/2.5/weather`
  - `GET https://api.openweathermap.org/data/2.5/air_pollution`
  - `GET https://pro.openweathermap.org/data/2.5/forecast/hourly`
  - `GET https://api.openweathermap.org/data/2.5/forecast/daily`
- Gọi tại:
  - `src/app/normal/shared_component/CurrentWeatherDetail.tsx`
  - `src/app/normal/shared_component/HourlyForecast.tsx`
  - `src/app/normal/shared_component/WeekForecastList.tsx`

### `tab=map`

- Page: `src/app/normal/page/map.tsx`
- API:
  - Noi bo Vietmap API:
    - `GET /api/vietmap-autocomplete`
    - `GET /api/vietmap-place`
    - `GET /api/vietmap-reverse`
    - `GET /api/vietmap-route`
  - `POST ${API_BASE_URL}/routes/history`
  - `GET https://api.openweathermap.org/data/2.5/weather` (lay weather theo tung segment)
- Gọi tại:
  - `src/app/normal/shared_component/LocationInputs.tsx`
  - `src/app/normal/shared_component/MapVisualization.tsx`
  - `src/app/normal/hooks/useVietmapFacade.ts`

### `tab=history`

- Page: `src/app/normal/page/history.tsx`
- API:
  - `GET ${API_BASE_URL}/routes/history`
  - `GET ${API_BASE_URL}/routes/weather-history`
  - Neu loi API thi fallback mock data
- Gọi tại:
  - `src/app/normal/shared_component/HistoryList.tsx`
  - `src/app/normal/shared_component/WeatherSearchHistory.tsx`
  - `src/context/services/api/personal/history.ts`

### `tab=persona`

- Page: `src/app/normal/page/persona.tsx`
- API:
  - `GET ${API_BASE_URL}/routes/locations`
  - `PUT ${API_BASE_URL}/routes/locations/{id}`
  - `DELETE ${API_BASE_URL}/routes/locations/{id}`
  - `GET ${API_BASE_URL}/routes` (khi mode business)
  - `PUT ${API_BASE_URL}/routes/favorites/{id}` (khi mode business)
  - `DELETE ${API_BASE_URL}/routes/favorites/{id}` (khi mode business)
  - `GET ${API_BASE_URL}/users/notifications`
- Gọi tại:
  - `src/app/normal/shared_component/PersonalFavoriteLocations.tsx`
  - `src/app/normal/shared_component/PersonalFavRoutes.tsx`
  - `src/app/normal/shared_component/PersonalSettings.tsx`

### `tab=account`

- Page: `src/app/normal/page/account.tsx`
- API:
  - `GET ${API_BASE_URL}/users/me`
  - `PUT ${API_BASE_URL}/users/me`
  - `POST ${API_BASE_URL}/auth/reset-password`
- Gọi tại:
  - `src/app/normal/shared_component/AccountProfileSection.tsx`
  - `src/app/normal/shared_component/AccountDetailsForm.tsx`
  - `src/app/normal/shared_component/AccountActionButtons.tsx`

---

## 4) Normal Business (`/normal/business/page?tab=...`)

### `tab=home`

- Giong `normal personal tab=home`, nhung mode business co them luong route trong `FavoritePlaces`.

### `tab=weather`

- Giong `normal personal tab=weather`.

### `tab=map`

- Giong `normal personal tab=map`.

### `tab=history`

- Giong `normal personal tab=history`.

### `tab=persona`

- Giong `normal personal tab=persona` (co ca route favorites va location).

### `tab=account`

- Giong `normal personal tab=account`.

### `tab=reports`

- Page: `src/app/normal/business/page/reports.tsx`
- API:
  - `GET ${API_BASE_URL}/routes` (bo loc route)
  - `GET ${API_BASE_URL}/users/me/report-schedules`
  - `POST ${API_BASE_URL}/users/me/report-schedules`
  - `GET https://history.openweathermap.org/data/2.5/history/city` (chart xu huong/tan suat)
  - `GET https://api.openweathermap.org/data/2.5/forecast` (phan tich rui ro)
  - `GET /api/vietmap-autocomplete` (tim kiem diem)
  - `GET https://maps.vietmap.vn/api/place/v3` (lay toa do chi tiet theo refid)
- Gọi tại:
  - `src/app/normal/business/component/ReportFilters.tsx`
  - `src/app/normal/hooks/useReportSettings.ts`
  - `src/app/normal/business/component/ReportCharts.tsx`
  - `src/app/normal/business/component/RiskAssessment.tsx`
  - `src/app/normal/hooks/useRiskAnalysisCommand.ts`
  - `src/app/normal/hooks/useVietmapFacade.ts`

---

## 5) Full Map

### `/normal/map_full/page`

- Page: `src/app/normal/map_full/page.tsx`
- API:
  - `GET /api/vietmap-autocomplete`
  - `GET /api/vietmap-place`
  - `GET /api/vietmap-route`
- Gọi tại:
  - `src/app/normal/map_full/page.tsx`
  - `src/app/normal/map_full/components/MapFullSidebar.tsx`

---

## 6) Ghi chu

- `API_BASE_URL` duoc khai bao tai `src/services/api-config.ts`:
  - Mac dinh: `http://localhost:3000/api`
  - Co the override bang env: `NEXT_PUBLIC_API_URL`
- Mot so service dung `handleRequest(...)` de fallback sang mock data neu loi API.
