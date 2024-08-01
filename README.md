# Animal Crossing BGM IRL
Listen to the Animal Crossing hourly background music (BGM) in real life (IRL) based on *your* local time and weather. Chill lo-fi music for study/sleep/relaxation.

Disclaimer: I do not own any of the audio media presented here.
 
## How It's Made
**Tech used:** HTML, CSS, JavaScript, ACNH API, Weatherbit API

For those unfamiliar with Animal Crossing, one of the unique features of the game is that there is different background music (BGM) for each hour of the day. Thanks to the folks at the [ACNH API](https://acnhapi.com), I was able to take the JSON data for the hourly background music and match it to the local time based on the browser. So, just by coming to the site, the BGM for your local time will start playing IRL (in real life).

After looking through the data, there are also three different versions for sunny, rainy, and snowy weather (though tbh it the rainy and snowy versions sound a lot alike..). This gave me the idea to find the weather data for the viewer's location using the coordinates via Geolocation and passing it through the Weatherbit API. 

## Optimizations

### Apr 1, 2021 - v0.3 - Functionality > Features
Rather than trying to fix the added features, I reverted the app to its basic function of taking the viewer's location to display the local date, time, and weather, and set the background image to a location-related image. However, it seems like the query to the Unsplash API is not getting correct images, so I'll have to rework that in the next few versions.

**Update**: Fixed the API request endpoint and now it seems to be working. It's still having issues running everything without the refresh though.

#### Other ideas
I noticed that it's pretty difficult to adjust the volume on the default audio player, so I think my next version will focus on creating a custom audio player.

### Mar 31, 2021 - v0.2 - New features
It's starting to look more like a webapp, but missing some core functions.

#### Fixes

- Refactored a lot of the code to make it more modular
- Added `css` to be better on the eyes
- Time is being updated by the second
- It now displays the time and date
- It now accepts input from the viewer for a *city, country* and will display the time and weather for that location

#### Bugs
- The page requires a refresh after the viewer inputs a location
- After the viewer inputs a location, the time doesn't update, even after the refresh
- Sizing issues on different sized screens


### Mar 30, 2021 - v0.1 - YES IT FINALLY WORKS 
I'm still considering this my 0.1 version, aka the "YES IT FINALLY WORKS" version. Some things I noticed that need updating.

#### Functionality

- I'm not sure my `fetch` requests are written as nicely as they could be. I definitely have to go back and refactor it.
- On the same note, I don't think it's necessary to update the weather info as frequently as the time (ie. every minute/second vs every hour, respectively), so I could make use of localStorage somehow.

#### Time-related

- The time doesn't actually update - it's stuck at the exact moment the viewer enters the site and then never updates again.
- Displaying the full day and date might be more helpful because it has more information.

#### Design

- Maybe using a framework like Bootstrap will give it a nice clean look.
- Having a cool background image would be nice, something either related to the location, weather, Animal Crossing or some combination.

#### Would be nice

- For viewers who'd like to be more private, they could enter their location info manually instead of allowing the site to access it. This would mean more cases to account for.
- For weather conditions like rain or snow, it would be cool to have actual weather sounds. Or maybe even sliders for ambient noises that the viewer could control and make it their own.
 
## Lessons Learned
 
I consider this one of my mini passion projects. I love playing Animal Crossing, so finding an API to do cool stuff with got me hyped about coding. I definitely got to refresh my knowledge of working on APIs. Especially with the new syntax, it was a real challenge to get the data back correctly. 
 














## Other Projects

Check out other stuff I've worked on:

**Secret Santa App**: https://github.com/geraldiner/secret-santa-app

**Minute To Win It Games API & Wiki**: https://github.com/geraldiner/min-to-win

## Currently I'm:

- Working full-time at <a target="_blank" href="https://nomnomnow.com">Nom Nom</a>, migrating JavaScript to TypeScript
- Building my brand, <a target="_blank" href="https://happiandco.com">Happi & Co. Studio LLC</a>

But I'm always open to hearing about your next big thing!

## Let's get to know each other!

Connect with me:

**Twitter**: [@GeraldineDesu](https://twitter.com/geraldinedesu)

**LinkedIn**: [in/GeraldineR](https://linkedin.com/in/geraldiner)

**Email**: hello [at] geraldiner [dot] com
