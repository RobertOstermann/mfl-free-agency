// Object containing all routes for MFL-Manager frontend
// Sorted into admin and user categories
const routes = {
  commissioner: {
    commissioner: "/commissioner",
  },
  owner: {
    home: "/",
    captracker: "/cap-tracker",
    players: "/players",
    freeagency: "/free-agency",
  },
};

// Array of all routes accessible by administrators
export const COMMISSIONER_ROUTES = Object.values(routes.commissioner);
// Array of all routes accessible by customers
export const OWNER_ROUTES = Object.values(routes.owner);

export default routes;
