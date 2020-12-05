# Youtube api view updater

This script will change you video title and thumbnail based on views and likes count, using youtube data api v3

## How to run

### Creating google youtube api application

Go to google console, activite the youtube data api [here][youtube]
you can try this steps directly on [google docs], or continue following my tutorial

Go to [credentials][credentials] of youtube api, click on `Create credentials > OAuth client ID.`;

Select the Web application application type.

add a anything name off your OAuth application

on redirect URIs, add this url:
`http://localhost:3000/oauth2callback`

save, you should now see client Id and secret key


### Getting the video id

You need to pass the video id to the program know what video need to automaticly change thumbanil and title, the video id can be get on anything video by the url, remember that the video you want to automate need to be of YOUR CHANNEL
https://www.youtube.com/watch?v=<Video id is here>

Examples:

https://www.youtube.com/watch?v=9bZkp7q19f0 have the `9bZkp7q19f0` as the video id
https://www.youtube.com/watch?v=fLexgOxsZu0 have the `fLexgOxsZu0` as the video id

### Configuring this repo

clone this repo

`
$ git clone <thisRepoUrl>
`

change directory to the created folder by git, and create a `.env` file

inside .env file, copy this snippet and replace the values that you get on Creating google youtube api application and getting video id

`
CLIENT_ID=<You client Id>
CLIENT_SECRET=<You secret>
VIDEO_ID=<you video Id>
`


### Running

on the project folder, on command line, write:
`
npm i
npm run start
`

You should see a new navigator tab opening to make an authenticate, log-in normally - If all are done, the title and thumbnail of the video id is now changed!

[youtube]: https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com
[credentials]: https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials
[google docs]: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps#creatingcred