# live-event-public  
  
## Description  
A public live event displays content to users who visit the event URL by clicking on the event card from the home page or directly to it by clicking the specific URL or scan an associated QR code.  
  
## Header  
The header is sticky and stacks above the tabs row. It shows the Momo Aux Platines logo on the left and the event image thumbnail (40×40, rounded) on the right. There is no language toggle — the language is inherited from the home page via the `?lang=` URL parameter.  
  
[live-event-public-header](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4553&t=ML5hptPgux0s4NeH-1)  
  
## Content  
### 5 tabs  
* Info  
* Battle  
* Played  
* Requests  
* Message  
  
### Now playing footer  
A sticky footer displays the song defined as playing. It shows the song title, artist and image. If the song is the same as a requested song, the footer shows a request icon on the right side.  
  
> The mechanism that sets which song is now playing do not change  
  
[live-event-public-now-playing-footer](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=839-2645&t=ML5hptPgux0s4NeH-1)  
  
## Info  
This tab is dedicated to give basic info about the event. The information shown is coming from the event creation form from the admin.   
  
> The form completion and visualisation rules created and now applied do not change  
  
It is composed of:  
* Image  
* Address  
* Date  
* Start time  
* End time  
* Instagram button  
* Twitch button  
  
[live-event-public-info](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2958&t=ML5hptPgux0s4NeH-1)  
  
## Battle  
This tab is dedicated to inform users that there could be battles when no battle has been set in the admin.  
This tab is dedicated to manage the users votes and display the ongoing results when the vote has been submitted.  
  
> The form completion and results rules created and now applied do not change  
  
### No battle started.  
When no battle is ongoing there should be a text message displayed.  
[live-event-public-battle-no-battle](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=860-1252&t=ML5hptPgux0s4NeH-1)  
  
### Battle in progress. Default state.  
When a battle is ongoing and a user visits the tab. The choices should be all displayed in their default state. The button should be disabled.  
[live-event-public-battle-in-progress-default](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2831&t=ML5hptPgux0s4NeH-1)  
  
### Battle in progress. Choice has been made.  
When a battle is ongoing and the user has made a choice. Choice can be changed as many times. Song card tapped should change to selected state. Button should be active.  
[live-event-public-battle-in-progress-chosen](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-2848&t=ML5hptPgux0s4NeH-1)  
  
### Battle in progress. Choice has been submitted. Time left until the battle ends.  
When a battle is ongoing and the user's choice has been submitted, the song cards should display their vote percentage inside the card as a progress bar. The songs should be listed from top voted at the top to least voted at the bottom. Top voted song (or songs) should show a green progress bar. Green copy should mention time remaining above the songs list.  
[live-event-public-battle-in-progress-submitted-on-going](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4631&t=ML5hptPgux0s4NeH-1)  
  
### Battle in progress. Choice has been submitted. Time ended.  
When a battle time has ended, the battle results should be displayed either until a new battle has been set in admin or until 10 minutes after the battle time has expired. If there is no new battle set after 10 minutes after the end of the battle, revert to no battle started screen.  
[live-event-public-battle-in-progress-submitted-ended](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4713&t=ML5hptPgux0s4NeH-1)  
  
## Played  
This tab lists all the songs that have been played since the beginning of the event. Songs are displayed most recent first.  

The intro text mentions that a request can be made — this is plain text only, not a link or button.  

Song cards show album artwork, title, and artist. Artwork is fetched automatically (iTunes → Deezer → Spotify). If artwork cannot be retrieved, no image area is shown — there is no placeholder.  
  
> The song card displayed information does not change  
  
[live-event-public-played](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3089&t=ML5hptPgux0s4NeH-1)  
[live-event-public-song-card](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=833-3422&t=ML5hptPgux0s4NeH-1)  
  
## Requests  
This tab allows users to submit a song request through inputting a Spotify song share URL.  
  
### Song request. Default.  
When the tab is selected, it shows an intro text and a mandatory input field.  
[live-event-public-requests-default](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3179&t=ML5hptPgux0s4NeH-1)  
  
### Song request. Input active.  
[live-event-public-input-active](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3267&t=ML5hptPgux0s4NeH-1)  
  
### Song request. Input confirmed.  
When the Spotify URL has been detected and confirmed, a song card appears with the related song title, artist and image. A delete icon can be tapped to cancel and bring the screen to its default state. The button is active.  
[live-event-public-request-input-confirmed](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-3422&t=ML5hptPgux0s4NeH-1)  
  
### Song request. Submitted.  
When a song has been successfully submitted, the screen sets back to default with a temporary success message. The success message should stay on screen for 5 seconds.  
[live-event-public-request-submitted](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=857-4550&t=ML5hptPgux0s4NeH-1)  
  
## Message  
This tab allows the user to send a message to the dj. The submit button is only active when the message has been entered into the input field.  
[live-event-public-message-default](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1266&t=ML5hptPgux0s4NeH-1)  
  
A confirmation is shown when the message has been typed and submitted.  
[live-event-public-message-submitted](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1314&t=ML5hptPgux0s4NeH-1)  
