# Prince Web Studio — Organized Projects

Each project is isolated in its own folder. Main pages, CSS, JavaScript and admin panels are kept together.

## Important working connections
- Gym: `gym.html` reads `gymPrograms` and `gymPlans` saved by `gym-admin.html`.
- Restaurant: `restaurant.html` reads `restaurantMenu` and `restaurantOffers` saved by `restaurant-admin.html`.
- LearnHub: admin uses the local server API and student pages sync from `/api/content`.

## LearnHub
Run `server.js` with Node from the `LearnHub` folder (`npm install` if needed, then `node server.js`). It uses port 3000.
