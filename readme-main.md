# Hey There! Welcome to Grassroots
## Who Are We?
Grassroots is London's newest platform for uniting grassroots venues, up and coming artists, and fans across the city. We set ourselves up to change the way things work in the London music scene, and give power back to the incredible artists and venues that make London the thriving and brilliant city it is.

## The Codebase
### Client
The client is where the Grassroots UI lives. Written in React.js, it includes:
- The homepage
- A bundle of user pages, including settings and profile,
- Pages for the venues and artists that we represent,
- An interactive map of grassroots venues in London so you can find a new venue near you,
- Sign in functionality, powered by [Descope](https://www.descope.com) that allow users to sign in, sign up, and have their own portals,
- The API interface that uses axios to talk to the Grassroots REST API and powers all things users,
- Artist and venue images and data, neatly stored in JSON documents

#### How To Run
To start up the client once you have cloned the repo, head to your command line and from the client directory run

`npm install`

to install the needed dependencies from npm for the project, and then

`npm run start`

to get the client up and running using [Vite](https://www.vite.dev).

Once you've completed both of those steps, the client should be up and running on port 3000, where you can see Grassroots in all it's glory!

### Server
The server is where the fun stuff happens. The mini Grassroots server, written using Express, node and JS, allows you to set up the backend that powers the user authentication. The core functionality of the server is to:

- Utilise the Descope node sdk to allow users to sign in using either an email address or a third party provider (OAuth),
- Grab user data from Descope for when displaying the user settings and profile,
- Create users by updating the Descope return with a user's chosen username (as well as checking that username hasn't already been taken!)

In the long term, Grassroots will pivot away from using Descope and instead self-host and manage user credentials. But in order to keep things as simple as possible for the time being, our friends at Descope are doing the hard work for us! 

#### How To Run
Similar to the steps for the client, use the command line to navigate yourself into the server directory. Once in there, run

`npm install`

to grab the npm packages required for the server. Once they're ready, start the server up by running

`npm start`

This allows nodemon to start the server, and fingers crossed you'll get a server running on port 8080.

> If you change the port that the server is running on, ensure that the Vite proxy config is also modified to the port you have chosen, otherwise the server and client won't be able to interact. 

## Where do we go from here?
Grassroots is still in it's early days - whilst we have a simple website running over on [Grassroots London](https://www.grassroots-london.com) it's nothing compared to this beautifully crafted website.

Grassroots will soon be fully independent from Descope and all of the nifty features we currently use Descope for will be mirrored in our own, self contained AWS project. Plus, we're aiming to allow artists and venues to manage their profiles themselves, add user favourites, and build the bridge between venues and artists buy implementing our 'gigs near you' sphere.

But for now, Grassroots will contently sit here and wait for the day when it can graduate from GitHub to the world. And we really hope you will be there for that journey with us!

## Get In Touch
Want to know more about Grassroots? You can email us on hello@grassroots-london.com, or give us a follow over on [Instagram](https://www.instagram.com/grassroots.ldn).

We're always looking for new artists, venues and devs to join our little community. Come be part of the community!

