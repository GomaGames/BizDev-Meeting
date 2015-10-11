# BizDev Meeting

## Meteor Hackathon game

Enjoy overtaking the tech scene with your friends!

A multiplayer cooperative social game to play with parties of 2 - 10 **in the same room**.

BizDevs love to have public meetings, in coffee shops, restaurants, libraries, etc.

Each player must visit [bizdev.meteor.com](http://bizdev.meteor.com) to play using their own personal device.

One person starts the game by "Calling a meeting". Meetings are usually about product development, running a startup, acquisitions, or mergers.

Once a meeting is created, each other player chooses "Join a Meeting", and enter the "Meeting code" that is displayed in the lobby of the first device.

When all players are present in the lobby, any player can begin the meeting.

Once a business development meeting is in session, each player will see instructions for a task, an action, or the direction of a company, and must order the entire room to perform the instructions on his/her screen. One of the other BizDevs in the room will have the ability to perform the task, so it is important to use clear and professional communication. After all, communicating is what Business Developers do best!

We have included hyper realistic, virtual Mannijer technology&trade; so you can now experience what it's like to hire offshore assets, and ship too early, through the eyes of Business guys.


## For Non-BizDevs

This game was built on October 10,11 2015 in < 24 hours _the bizdevs at Meteor really did a great job!_

Feel free to contribute to the project, open any issues or PRs if you have any suggestions or improvements.

Our goal was also to encourage others to fork this project and create your own themed social game. It's not much of a framework, and not very extensible yet, so _if_ we see any real interest, we should clean up the code base more to make customization easier.

Make sure to include the [license](LICENSCE) _our bizdev told us to remind you_


### Running with Meteor

the typical meteor workflow applies.

go into the `game/` subdirectory, and run the app locally with `meteor` cli.


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
docker run -it --name bizdev --rm -p 3000:3000 -v "$PWD":/app --link bdm-db:db -e "MONGO_URL=mongodb://db" danieldent/meteor
```

running any meteor commands such as `add` or `deploy`
```
docker run -it --rm -v "$PWD":/app danieldent/meteor meteor [your command and arguments here]
```
