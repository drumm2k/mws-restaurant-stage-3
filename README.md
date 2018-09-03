# Mobile Web Specialist certification course
## About
For the Restaurant Reviews projects I converted a static webpage to a mobile-ready web application.

![Desktop Screenshot](/screenshots/desktop.jpg)

### Stage 1 🚀
At this stage I was given static design, written pretty badly.
I converted design to suit all screen sizes with mobile-first approach, CSS code was refactored. All of this was done with accessibility (WAI-ARIA) in mind, so this web application is accessible by people with disabilities. Then using Cache API and a ServiceWorker I added static site to cache for offline use.

### Stage 2 🚀
At this stage I was given backend server based on Sails.js.
I connected app to an external server using asynchronous JavaScript to request JSON data of restaurants data and reviews, then stored this data in an offline database using IndexedDB, which create an app shell architecture.

Finally optimized app to meet performance benchmarks requirements using Lighthouse:

Progressive Web App ≥ 90 (app scores 91).

Performance ≥ 70 (app scores 87).

Accessibility ≥ 90 (app scores 94).

### Stage 3 🚀
At this stage I was given backend server with updated functionality.
I added a form to allow users to create their own reviews and a favorite toggle, so users are able to mark a restaurants they like. Then i added functionality to defer updates until user is connected. All offline data is stored in database and submitted automatically when re-connected.

#### When offline - store all comments locally:
![Lighthouse Audit](/screenshots/offline.png)

#### When online - pushing all offline comments to the server:
![Lighthouse Audit](/screenshots/online.png)

Finally optimized app to meet even stricter performance benchmarks requirements using Lighthouse:

Progressive Web App ≥ 90 (app scores 92, it will be 100 with https).

Performance ≥ 90 (app scores 98).

Accessibility ≥ 90 (app scores 100).
![Lighthouse Audit](/screenshots/audit.png)

## Usage
### Backend
Navigate to /backend folder and execute.
###### Install project dependencies
```Install project dependencies
# npm i
```
###### Install Sails.js globally
```Install sails global
# npm i sails -g
```
###### Start the server
```Start server
# npm start
```

### Frontend
Navigate to /frontend folder.
If you don't need Map titles feel free to skip first 2 steps.
###### Edit /src/js/main.js and add Mapbox accessToken in initMap()
```
# accessToken = ''
```
###### Edit /src/js/restaurant_info.js and add Mapbox accessToken in initMap()
```
# accessToken = ''
```
###### Install project dependencies
```Install project dependencies
# npm i
```
###### Build the project
```Build the project
# npm run build
```
###### Start frontend
```Start frontend
# npm start
```
