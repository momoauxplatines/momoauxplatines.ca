# event-admin  
  
## Description  
An admin event allows the dj to manage the event. The dj is able so see live interactions from and with the users. The dj can also manage what is identified as playing and create interactive battles.  
  
## Content  
### Tabs  
* Playing  
* Battle  
* Requests  
* Messages  
  
## Playing  
This tab is dedicated to define what song is now playing.  
  
> The functionality rules created and now applied do not change.  
  
It is composed of:  
* List of songs coming from Serato live Playlist  
  
Dj defines what song is now playing from the list coming from Serato Live Playlist now in effect.  
The song defined as Now Playing is shown in the event Now Playing sticky footer at the bottom of the page. If the song defined as played has the same artist name and song title as a request, a requested icon appears in the now playing footer.  
Songs that already have been defined as played show a played indicator.  
[event-admin-playing-live](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1802&t=ML5hptPgux0s4NeH-1)  
  
If the event has not received any song information from the Serato Live Playlists, the page displays a message.  
[event-admin-playing-no-song](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1669&t=ML5hptPgux0s4NeH-1)  
  
  
## Battle  
This tab is dedicated to create a voting poll called a battle to offer the users to decide what song from the ones suggested should be played during a specific time period. Dj can define a specific time period for the length of the battle. Only one battle can be held at a time.  
  
> The functionality rules created and now applied do not change.  
  
### Event is not live yet.  
A text message saying “Battles can only be set once the event is live.” is shown.  
[event-admin-battle-event-not-started](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1859&t=ML5hptPgux0s4NeH-1)  
  
### No battle started. Default.  
Dj is shown a drop down input labeled “Time*” that sets time for the battle to take place in the first input field. The drop down field is set to 15 minutes by default. Time can be changed to “5 minutes” or “30 minutes” That time sets the visibility of the list of songs on the users side.  
Dj is shown a search field labeled “Add 2 to 5 songs*” where a Spotify song URL can be pasted to set the songs to be available to vote for.  
“Start new battle” button is visible but inactive in the sticky footer.  
[event-admin-battle-creating-default](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=836-2517&t=ML5hptPgux0s4NeH-1)  
  
### No battle started. Filled.  
Dj needs to paste Spotify share link to the songs available for to vote for in the battle. From two to five songs need to be entered for the battle to be started. 2 to 5 songs need to be added and listed for the battle to be started.  
A song can be removed from the list if the X icon is pressed.  
“Start new battle” button is visible and active in the sticky footer if all necessary conditions are met.  
[event-admin-battle-creating-filled](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=757-3143&t=ML5hptPgux0s4NeH-1)  
  
### Battle. Ongoing.  
When a battle is ongoing, a green message stating “Time remaining:” along with the time remaining in numbers counting down in real time and the results song cards are shown on the screen. Songs should be listed from top voted to least voted from top to bottom. “Create new battle” button is visible but inactive in the sticky footer.  
[event-admin-battle-ongoing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=836-2393&t=ML5hptPgux0s4NeH-1)  
  
### Battle. Ended.  
When a battle has ended, a red message stating “Battle ended” and the results song cards are shown on the screen. Songs should be listed from top voted to least voted from top to bottom. “Create new battle” button is visible and active in the sticky footer.  
[event-admin-battle-ended](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=836-2467&t=ML5hptPgux0s4NeH-1)  
  
## Requests  
This tab lists all the song that have been requested since the event has been created.  
  
> The functionality rules created and now applied do not change.  
  
### Requests. No requests made.  
Dj is known a text message saying “No requests have been made yet.”.  
“Refresh” button is visible and active in the sticky footer.  
[event-admin-requests-none](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=555-4191&t=ML5hptPgux0s4NeH-1)  
  
### Requests. Event not started. Requests Added.  
When an event has not started yet but some requests have been submitted, dj is shown all request song cards in a list. Most recent request cited at the top to least recent request at the bottom.  
Dj can remove a request from the list by tapping on the X red icon on the right of a requested song card.  
“Refresh” button is visible and active in the sticky footer.  
[event-admin-requests-not-started-added](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1896&t=ML5hptPgux0s4NeH-1)  
  
### Requests. Event live. Default.  
When an event has not started yet but some requests have been submitted, dj is shown all request song cards in a list. Most recent request cited at the top to least recent request at the bottom.  
Dj can mark the request s played by turning the toggle on at the right of a requested song card. This action will indicate that the requested song has been played on the users side by switching the “requested song” icon to “played requested song” icon on the song card in the played tab of the event.  
“Refresh” button is visible and active in the sticky footer.  
[event-admin-requests-live-default](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=487-3818&t=ML5hptPgux0s4NeH-1)  
  
### Requests. Event live. Requested songs selected.  
Dj can select from 2 to 5 songs by tapping the song cards from the requested songs list to create a new battle.  
If only one song is selected,  the footer button changes from active “Refresh” button to inactive “Create a battle” button.  
When 2 to 5 songs are selected, the “Create a battle” footer button becomes active. If the user hits the active “Create a battle” button, it creates a new battle.  
[event-admin-requests-live-songs-selected](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=844-3550&t=ML5hptPgux0s4NeH-1)  
If request song cards have been selected and the “Create a battle” button is pressed while a battle is ongoing, second battle is not created and error message is shown  
[event-admin-requests-live-battle-ongoing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=872-1151&t=ML5hptPgux0s4NeH-1)  
  
## Messages  
This tab displays all messages sent from users through the “Message” tab from the same event.  
  
### Messages. Empty.  
Dj is known a text message saying “No messages have been sent to you yet.”.  
“Refresh” button is visible and active in the sticky footer.  
[event-admin-messages-empty](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1386&t=ML5hptPgux0s4NeH-1)  
  
### Messages. Added.  
The page displays a list of all messages from most recent to least recent from top to bottom.  
Every message card displays the message sent and the time at which it has been sent  
“Refresh” button is visible and active in the sticky footer.  
[event-admin-messages](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-1958&t=ML5hptPgux0s4NeH-1)  
