# BizDev Meeting

## Meteor Hackathon game

spaceteam clone






### Running in Docker

setup persistent mongo db, link to this from ephemeral meteor container
```
docker run --name bdm-db -d mongo
```

run meteor project

be in project, /game subdirectory
```
cd ./game
```

run meteor app in docker
```
docker run -it --rm -p 3000:3000 -v "$PWD":/app --link bdm-db:db -e "MONGO_URL=mongodb://db" danieldent/meteor
```
