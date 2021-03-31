# Animal Crossing BGM IRL
Write a short sentence or two about this project and what it does. Be sure to include a link and a screenshot (we're front end devs o we can actually see our work!).
 
*Link to project:* https://geraldiner.com/acnh-bgm-irl
 
# How It's Made:
*Tech used:* HTML, CSS, JavaScript, ACNH API, Weatherbit API

For those unfamiliar with Animal Crossing, one of the unique features of the game is that there is different background music (BGM) for each hour of the day. Thanks to the folks at the (ACNH API) [https://acnhapi.com], I was able to take the JSON data for the hourly background music and match it to the local time based on the browser. So, just by coming to the site, the BGM for your local time will start playing IRL (in real life).

After looking through the data, there are also three different versions for sunny, rainy, and snowy weather (though tbh it the rainy and snowy versions sound a lot alike..). This gave me the idea to find the weather data for the viewer's location using the coordinates via Geolocation and passing it through the Weatherbit API. 

# Optimizations
I'm still considering this my 0.1 version, aka the "YES IT FINALLY WORKS" version. Some things I noticed that need updating.

### Functionality

- I'm not sure my `fetch` requests are written as nicely as they could be. I definitely have to go back and refactor it
- On the same note, I don't think it's necessary to update the weather info as frequently as the time (ie. every minute/second vs every hour, respectively), so I could make use of localStorage somehow

### Time-related

- The time doesn't actually update - it's stuck at the exact moment the viewer enters the site and then never updates again
- Displaying the full day and date might be more helpful because it has more information

### Design

- Maybe using a framework like Bootstrap will give it a nice clean look
- Having a cool background image would be nice, something either related to the location, weather, Animal Crossing or 

### Would be nice

- For viewers who'd like to be more private, they could enter their location info manually instead of allowing the site to access it. This would mean more cases to account for.
- For weather conditions like rain or snow, it would be cool to have actual weather sounds. Or maybe even sliders for ambient noises that the viewer could control
 
# Lessons Learned:
 
I consider this one of my mini passion projects. I love Animal Crossing and playing it. So finding an API and 
 
# Examples:
Take a look at these couple examples that I have in my own portfolio:
 
*JS Challenges:** https://geraldiner.com/jschallenges/
 
*Twitter Battle:** https://github.com/alecortega/twitter-battle
 
*Patch Panel:** https://github.com/alecortega/patch-panel