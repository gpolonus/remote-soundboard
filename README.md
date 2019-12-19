# Remote SoundBoard

Play sounds on a host device from remote devices! Created so that several devices could play sounds from a soundboard on one device connected to a speaker.

## Setup

```
cd be
npm i
cd ../fe
npm i
echo "REACT_APP_SOCKET_URL=<the URL to your socket>" >> .env
```

## Start

In the first terminal:
```
cd be
node server.js
```

In a second terminal:
```
echo
cd fe
npm start
```
