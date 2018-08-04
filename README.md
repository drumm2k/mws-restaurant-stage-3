# Mobile Web Specialist certification course
## About
For the Restaurant Reviews projects I converted a static webpage to a mobile-ready web application.
### Stage 1 🚀
At this stage I was given static design, looks like it was made by a six grader, btw i think it is hard to replicate code like this.
I converted design to suit all screen sizes with mobile-first approach, fixed style issues. All of this was done with WAI-ARIA in mind, so this web application is more accessible to people with disabilities. Also service worker was added, for basic offline experience.

### Stage 2 🚀
At this stage I was given backend server based on Sails.js.
I connected app to an external server using asynchronous JS to request JSON data of restaurants data and reviews, then stored this data in an offline database using IndexedDB, which create an app shell architecture.
Finally optimized app to meet performance benchmarks requirements using Lighthouse:

Progressive Web App ≥ 90 (app scores 91).

Performance ≥ 70 (app scores 87).

Accessibility ≥ 90 (app scores 94).

### Stage 3 🚀
At this stage I was given backend server with updated functionality.
I added a form to allow users to create their own reviews and a favorite toggle, so users are able to mark a restaurants they like. If the app is offline, all data stored in a database until a connection is established, so it's fully functional without connection.
Finally optimized app to meet even stricter performance benchmarks requirements using Lighthouse:

Progressive Web App ≥ 90 (app scores 91, no https).

Performance ≥ 90 (app scores 96).

Accessibility ≥ 90 (app scores 100).

## Usage
### Backend
Navigate to /backend folder and execute
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
Navigate to /frontend folder
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
