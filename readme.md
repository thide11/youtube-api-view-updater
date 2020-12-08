
# YouTube API view updater

This script will change your video title and thumbnail based on views and likes count, using YouTube data API v3

![Example of working project](docs/example.png)

## How to run

### Creating Google YouTube API application

Go to Google console, activate the YouTube data API [here][youtube]

After activated, you can the steps of  OAuth configuring on [Google Docs], or continue following my tutorial

  -Go to [credentials][credentials] of youtube api, click on `Create
   credentials > OAuth client ID.`

  -Select the Web application application type. add a anything name off your OAuth application

  -On redirect URIs, add this url:
   `http://localhost:3000/oauth2callback`

Save, and you should now see client Id and secret key

### Getting the video id

You need to pass the video id to the program know what video need to automatically change thumbnail and title, the video id can be get on anything video by the URL, remember that the video you want to automate need to be of YOUR CHANNEL

    https://www.youtube.com/watch?v=<Video id is here>

Examples:

<https://www.youtube.com/watch?v=9bZkp7q19f0> have the `9bZkp7q19f0` as the video id

<https://www.youtube.com/watch?v=fLexgOxsZu0> have the `fLexgOxsZu0` as the video id

### Configuring this project

clone this repository on command-line

    git clone https://github.com/thide11/youtube-api-view-updater

change directory to the created folder by git (cd youtube-api-view-updater), and create a `.env` file

inside .env file, copy this snippet and replace the values that you get on Creating google YouTube API application and getting video ID topics

    CLIENT_ID=<You client Id>
    CLIENT_SECRET=<You secret>
    VIDEO_ID=<you video Id>

### Running

on the project folder, on command line, write:

    npm install
    npm run start

You should see a new navigator tab opening to make authenticate, log-in with Google normally - If all are done, the title and thumbnail of the video id will be changed!

The thumbnail have a delay to update, to instantly look the new image, add the video on a playlist and look the thumbnail of him on the playlist listing

### Allow standalone mode

Running this program will update the video data only 1 time, but if you want to continually update, configure a cron job to run this script or publish this on a server and enable standalone mode

To enable standalone mode, run this code once and log-in with youtube, probably will cache as a JSON the credentials on the HOME or USERPROFILE directory, followed by `/.credentials/cache/autentication-cache.json`, copy the content of this file and add on .env this values :

    LOGIN_DATA=<The json content here>
    STANDALONE=true

when configured, each access to `http://localhost:3000`  will update video views, you can deploy to a web server and configure [Cloud scheduler][cloud scheduler] to access your server URL

but be careful, you are limited to use 10000 "quota points" of YouTube API, each run of this program cost 101 points:

 -1 to read current view/likes count

 -50 to change the title of video

 -50 to change the thumbnail

[More details of quota you can read here][quota costs]

A recommended run frequency of this program is each 15 minutes

[youtube]: https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com

[credentials]: https://console.cloud.google.com/apis/api/youtube.googleapis.com/credentials

[google docs]: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps#creatingcred

[quota costs]: https://developers.google.com/youtube/v3/determine_quota_cost
[cloud scheduler]: https://cloud.google.com/scheduler
