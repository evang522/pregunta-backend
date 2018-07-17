# Pregunta
Explain yourself to the world.


## Feature Summary
- Users may create an account which they may log into with OAuth or local Login
- Every user has a profile page which displays a list of questions. 
- Others may post questions on a user's profile page, which the user, (and only the user to whom the profile page belongs) may answer the question *once*. 
- Questions may be upvoted or downvoted. Questions with the highest positive vote will be placed at the top of the profile. Questions with the highest negative vote will be sorted towards the bottom.
- Users have the ability to delete questions on their own profiles that they don't consider appropriate.


# Tech Stack


- MongoDB
- Node.js
- Express.js
- React.js
- Redux
- Google OAuth


# Pregunta API:

## Questions (`/api/questions?userId=983240-fjf02`)
- GET:
  - Requires User Query `userId`
- GET BY ID:
  - `/api/questions/3452345-3452345-234524`
- POST (`/api/questions`)
  - Requires `{title}` and `{body}` in request body.
  - Constructs a mongo Document with keys: `{id, title, body, response, votes(Array)}`
- PUT (`/api/questions/:id`)
  - Requires `{requestType} in request Body`
  - If `requestType` === `'topLevel'`
    - The document's top-level attributes can be updated: `{title, body, and response}`
    - Only a question's author may alter the title and body of a question. The user answering the question may edit their answer after posting. 
  - If `requestType` === `'vote'`
    - `{voteType}` key required in request body.
    - User will be recorded as having voted the way they did in an array.
- DELETE `(/api/questions/:id)`
  - Requires ID parameter
  - Deletes Question from Database


## Users

- GET (`/api/users/:id`)
  - Returns publicly available information about user
- POST (`/api/users`)
  - Requires `{handle, email, password}` in request body
- PUT (`/api/users/:id`)
  - Requires `{handle, email, password, about,`or `bio}`
- DELETE (`/api/users/:id`)
  - Requires ID Parameter
  - Deletes User from System
