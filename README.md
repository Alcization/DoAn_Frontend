This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).


## Folder Structure

```text
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── vietmap-autocomplete/api.ts
│   │   │   ├── vietmap-place/api.ts
│   │   │   ├── vietmap-search/api.ts
│   │   │   ├── vietmap-reverse/api.ts
│   │   │   └── vietmap-route/api.ts
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── AuthButton.tsx
│   │   │   │   ├── AuthDivider.tsx
│   │   │   │   ├── AuthInput.tsx
│   │   │   │   ├── AuthLayout.tsx
│   │   │   │   ├── AuthRoleSelect.tsx
│   │   │   │   ├── SignupRoleSelector.tsx
│   │   │   │   └── SocialLoginButton.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLoginForm.ts
│   │   │   │   ├── useNewPassword.ts
│   │   │   │   ├── useSignupForm.ts
│   │   │   │   └── useVerifyEmail.ts
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── verify-email/page.tsx
│   │   │   └── new-password/page.tsx
│   │   ├── government/
│   │   │   ├── component/
│   │   │   │   ├── heatmap/
│   │   │   │   │   ├── logic/
│   │   │   │   │   │   ├── GeoJSONBuilder.ts
│   │   │   │   │   │   ├── HeatmapFactories.ts
│   │   │   │   │   │   ├── HeatmapStrategies.ts
│   │   │   │   │   │   └── HeatmapTypes.ts
│   │   │   │   │   ├── HeatmapView.tsx
│   │   │   │   │   └── VietMapHeatmap.tsx
│   │   │   │   ├── history-logic/
│   │   │   │   │   ├── HistoryItemFactory.tsx
│   │   │   │   │   ├── HistoryStrategies.ts
│   │   │   │   │   └── HistoryTypes.ts
│   │   │   │   ├── scenario-logic/
│   │   │   │   │   ├── ScenarioItemFactory.tsx
│   │   │   │   │   ├── ScenarioStrategies.ts
│   │   │   │   │   └── ScenarioTypes.ts
│   │   │   │   ├── AreaForm.tsx
│   │   │   │   ├── KPIStats.tsx
│   │   │   │   ├── ReportConfigForm.tsx
│   │   │   │   ├── ReportHistoryList.tsx
│   │   │   │   └── sidebar.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── DashboardService.ts
│   │   │   │   ├── useActivateScenario.ts
│   │   │   │   ├── useAreaManagement.ts
│   │   │   │   ├── useDashboard.ts
│   │   │   │   ├── useHistoryManagement.ts
│   │   │   │   ├── useReportManagement.ts
│   │   │   │   ├── useResponseRoute.ts
│   │   │   │   ├── useScenarioFilters.ts
│   │   │   │   └── useScenarioManagement.ts
│   │   │   ├── modal/
│   │   │   │   ├── logic/
│   │   │   │   │   ├── ModalItemFactory.tsx
│   │   │   │   │   ├── ModalStrategies.ts
│   │   │   │   │   └── ModalTypes.ts
│   │   │   │   ├── ActivateScenarioModal.tsx
│   │   │   │   ├── AddStepModal.tsx
│   │   │   │   ├── DeleteAreaModal.tsx
│   │   │   │   ├── DeleteScenarioModal.tsx
│   │   │   │   ├── EditAreaModal.tsx
│   │   │   │   ├── EditScenarioModal.tsx
│   │   │   │   ├── FilterScenarioModal.tsx
│   │   │   │   ├── QuickAddAreaModal.tsx
│   │   │   │   └── ResponseRouteModal.tsx
│   │   │   └── page/
│   │   ├── normal/
│   │   │   ├── business/
│   │   │   │   ├── component/
│   │   │   │   │   ├── RiskLocationInput.tsx
│   │   │   │   │   ├── RiskAnalysisResult.tsx
│   │   │   │   │   ├── ReportHeader.tsx
│   │   │   │   │   ├── KPISection.tsx
│   │   │   │   │   ├── RiskAssessment.tsx
│   │   │   │   │   ├── ReportFilters.tsx
│   │   │   │   │   ├── ReportSettings.tsx
│   │   │   │   │   ├── sidebar.tsx
│   │   │   │   │   ├── ReportCharts.tsx
│   │   │   │   │   ├── RiskTimeSelect.tsx
│   │   │   │   │   └── RiskAssessmentHeader.tsx
│   │   │   │   └── page/
│   │   │   │       ├── reports.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── map_full/
│   │   │   │   ├── components/
│   │   │   │   │   ├── MapFullSidebar.tsx
│   │   │   │   │   ├── MapFullBottomPanel.tsx
│   │   │   │   │   └── MapFullControls.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── personal/
│   │   │   │   ├── component/
│   │   │   │   │   └── sidebar.tsx
│   │   │   │   └── page/
│   │   │   │       └── page.tsx
│   │   │   ├── shared_component/
│   │   │   │   ├── AccountActionButtons.tsx
│   │   │   │   ├── AccountDetailsForm.tsx
│   │   │   │   ├── AccountProfileSection.tsx
│   │   │   │   ├── BaseModal.tsx
│   │   │   │   ├── CurrentWeatherCard.tsx
│   │   │   │   ├── CurrentWeatherDetail.tsx
│   │   │   │   ├── FavoriteItemFactory.tsx
│   │   │   │   ├── FavoritePlaceItem.tsx
│   │   │   │   ├── FavoritePlaces.tsx
│   │   │   │   ├── ForecastSection.tsx
│   │   │   │   ├── HistoryFilterBar.tsx
│   │   │   │   ├── HistoryList.tsx
│   │   │   │   ├── HourlyForecast.tsx
│   │   │   │   ├── LocationComponentFactory.tsx
│   │   │   │   ├── LocationInputs.tsx
│   │   │   │   ├── LocationSelector.tsx
│   │   │   │   ├── MapHeader.tsx
│   │   │   │   ├── MapVisualization.tsx
│   │   │   │   ├── PersonalFavRoutes.tsx
│   │   │   │   ├── PersonalFavoriteLocations.tsx
│   │   │   │   ├── PersonalSection.tsx
│   │   │   │   ├── PersonalSettings.tsx
│   │   │   │   ├── QuickAccessGrid.tsx
│   │   │   │   ├── VietMap.tsx
│   │   │   │   ├── WeatherAlert.tsx
│   │   │   │   ├── WeatherHeader.tsx
│   │   │   │   ├── WeatherMetricFactory.tsx
│   │   │   │   ├── WeatherSearchHistory.tsx
│   │   │   │   └── WeekForecastList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── RouteBuilder.ts
│   │   │   │   ├── VisualizationStrategy.ts
│   │   │   │   ├── useChartStrategy.ts
│   │   │   │   ├── useFavoriteCommands.ts
│   │   │   │   ├── useHistoryFilters.ts
│   │   │   │   ├── useKPIDataFactory.ts
│   │   │   │   ├── useLocationCommands.ts
│   │   │   │   ├── useLocationForm.ts
│   │   │   │   ├── useLocationMediator.ts
│   │   │   │   ├── useModal.ts
│   │   │   │   ├── useModalActions.ts
│   │   │   │   ├── usePagination.ts
│   │   │   │   ├── useReportFilters.ts
│   │   │   │   ├── useReportSettings.ts
│   │   │   │   ├── useRiskAnalysisCommand.ts
│   │   │   │   ├── useRoutingStrategy.ts
│   │   │   │   ├── useVietmapFacade.ts
│   │   │   │   └── useWeatherAdapter.ts
│   │   │   ├── modal/
│   │   │   │   ├── AddFavoritePlaceModal.tsx
│   │   │   │   ├── ChangePasswordModal.tsx
│   │   │   │   ├── DeleteLocationModal.tsx
│   │   │   │   ├── EditLocationModal.tsx
│   │   │   │   ├── LocationPickerMap.tsx
│   │   │   │   ├── SetAlertModal.tsx
│   │   │   │   └── ViewAllFavoritesModal.tsx
│   │   │   └── page/
│   │   │       ├── account.tsx
│   │   │       ├── history.tsx
│   │   │       ├── home.tsx
│   │   │       ├── map.tsx
│   │   │       ├── persona.tsx
│   │   │       └── weather.tsx
│   │   ├── shared_component/
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── route/
│   │   │   └── routing.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── context/
│   │   ├── language/
│   │   │   ├── locales/
│   │   │   ├── i18n.ts
│   │   │   └── LanguageProvider.tsx
│   │   ├── sidebar/
│   │   │   └── SidebarContext.tsx
│   │   ├── theme/
│   │   │   └── ThemeContext.tsx
│   │   └── services/
│   ├── services/
│   │   └── api-config.ts
│   └── util/
│       ├── fullscreen_control.ts
│       ├── polyline.ts
│       └── zoom_to_bounds_control.ts
├── public/
│   ├── asssets/
│   │   ├── icon/
│   │   │   ├── bell.png
│   │   │   ├── brightness.png
│   │   │   ├── internet.png
│   │   │   ├── menu.png
│   │   │   ├── night-mode.png
│   │   │   └── user.png
│   │   ├── logo/
│   │   │   └── Logo.png
│   │   ├── mascot/
│   │   └── google.svg
│   ├── favicon.ico
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── file.svg
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── eslint.config.mjs
└── postcss.config.mjs
```


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
