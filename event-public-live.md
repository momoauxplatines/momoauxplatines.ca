# event-public-live  
  
## Description  
A live event page is a public page for users to visit to be informed about the event, what plays and participate by sending requests, vote for song in battles and send messages. A live event page has its own URL and is opened in a new tab by clicking on the event card on the home page if made public in the admin.   
  
## Header  
* logo.box  
* event.status (live)  
* event.thumbnail  
##   
## Tabs  
* Info  
* Battle  
* Played  
* Request  
* Message  
  
## Info  
This tab is dedicated to show the event info, image and links to social medias.  
  
Content:  
* event.image  
* event.name  
* event.address  
* event.date  
* event.hours  
* instagram.button  
* twitch.button  
  
[event.public.live.info](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2958&m=dev)  
  
  
## Battle  
This tab allow the users to participate to an active battle by selecting and submitting a song vote. If no battle is available, a message is shown.   
  
### Battle unavailable  
Content:  
* message.no-battle  
[event.public.live.battle.no-battle](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=860-1252&m=dev)  
  
### Battle ongoing  
Content:  
* message.battle-active.no-vote  
* list  
    * song.battle  
* submit.button  
[event.public.live.battle.active](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2831&m=dev)  
  
Once the song has been chosen by tapping on it, the submit button becomes active.   
[event.public.live.battle.active.vote](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2848&m=dev)  
  
Once the vote has been submitted, the Battle Result page is shown  
  
### Battle ongoing results  
Content:  
* messgage.battle-result.ongoing  
* list  
    * song.battle.leading  
    * song.battle.contender  
* message.battle.ongoing  
[event.public.live.battle.result.ongoing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4631&m=dev)  
##   
### Battle ended results  
Content:  
* messgage.battle-result.ended  
* list  
    * song.battle.leading  
    * song.battle.contender  
* message.battle.ended  
[event.public.live.battle.result.ended](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4713&m=dev)  
  
## Played  
This tab shows a list of songs that has been defined as played from the admin. Songs are listed from most recent played at the top to least recent played at the bottom.  
  
Content:  
* list  
    * song.played or song.played.requested  
* message.played  
[event.public.live.played](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3089&m=dev)  
  
If a song listed in the page has the same artist name and song name, the song card should be song.played.requested  
  
##   
## Request  
This tab allows users to send a request to the admin. Users need to copy and paste a Spotify song share link URL from the mobile app and paste it into the search field. Once the field recognizes the URL, the page shows a song.request-form card. Once the song card is shown, the user needs to press the submit button. When submitted successfully, a success message is shown and the search field reverts to its default state.  
  
### Request  
Content:  
* input.field.spotify  
* message.request  
* button.submit  
[event.public.live.request](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3179&m=dev)  
  
### Request song recognized  
Content:  
* input.field.spotify  
* song.request.form  
* button.submit  
[event.public.live.request.song-recognized](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3422&m=dev)  
  
### Request sent  
Content:  
* input.field.spotify  
* message.system (success)  
* button.submit  
[event.public.live.request.sent](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4550&m=dev)  
  
After a 5 seconds delay, user is sent to [event.public.live.request](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3179&m=dev) page.  
##   
## Messages  
This tab allows users to send messages to the dj admin. The submit button is by default inactive and becomes active when text has been written into the input field.  
  
### Message  
Content:  
* input.field  
* button.send  
[event.public.live.message](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1266&m=dev)  
  
### Message sent  
Content:  
* input.field  
* button.send  
* messages.system (success)  
[event.public.live.message.sent](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1314&m=dev)  
  
## Footer  
The footer displays the song info defined as playing from the admin.   
  
> The functionality rules created and now applied do not change.  
  
Content:  
* song.image  
* icon.play  
* song.name  
* artist.name  
[footer.song.playing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=839-2645&m=dev&t=rDkkbCrnTmkjETh6-1)  
