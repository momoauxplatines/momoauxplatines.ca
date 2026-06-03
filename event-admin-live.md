# event-admin-live  
  
## Description  
An admin event allows the dj to manage the event info. The admin is able to see live interactions like messages, requests and battles from and with the users. The admin can also manage what is identified as playing and create interactive battles.  
  
An event has its own specific URL.  
  
## Header  
* button.back  
* event.status (live)  
* event.thumbnail  
  
## Tabs  
* Info  
* Playing  
* Battle  
* Requests  
* Messages  
  
## Info  
This tab is dedicated to edit the info, image and links describing the event.  
  
> The mandatory fields defined and now applied do not change.  
  
Admin can edit event info once the event has ben created. Changes are applied only if Save button is pressed.  
  
It is composed of:  
* Name  
* Address  
* Date  
* Start time  
* End time  
* Instagram button  
* Twitch button  
* Image  
* Show on home page toggle  
* Delete  
[event-admin-info.phone](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3516&m=dev)  
  
Admin can delete the event if Delete button is pressed and confirmed in the confirmation popup. Use the browser’s confirmation popup process for this step.  
  
  
## Playing  
This tab is dedicated to define what song is now playing.  
  
> The functionality rules created and now applied do not change.  
  
Content:  
* list  
    * song.admin.playing  
* button.refresh  
  
Admin defines what song is now playing from the list coming from Serato Live Playlist by tapping on the button song (to be played) in the song admin playing card listed.  
The song defined as now playing is shown in the public event pow Playing sticky footer at the bottom of the event page.  
  
[event.admin.live.playing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3641&m=dev)  
  
  
## Battle  
This tab is dedicated to create a voting poll called a battle to offer the users to decide what song from the ones suggested should be played during a specific time period. Dj can define a specific time period for the length of the battle. Only one battle can be held at a time.  
  
> The functionality rules created and now applied do not change.  
  
### No battle started  
Content:  
* linput.field.time  
* input.field.spotify  
* button.create-a-battle  
  
Admin needs to set the time of the battle.  
Admin needs to add songs by copying a Spotify mobile app share link into the input field. When a song URL is submitted and recognized, the song admin battle card is listed below the input field.  
When 2 to 5 songs have been successfully submitted, the page changes to event.admin.live.battle.ready  
  
[event.admin.live.battle](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3693&m=dev)  
  
### Battle ready to start  
Content:  
* linput.field.time  
* input.field.spotify  
* song.admin.battle  
* button.create-a-battle  
  
When 2 to 5 songs need to be added and listed for the start the bottle button to be active.  
A song can be removed from the list if the X icon is pressed. If a song is removed and the quantity of added songs becomes lower than two, the start the battle button becomes inactive  
  
[event.admin.live.battle.ready](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3675&m=dev)  
  
### Ongoing battle  
Content:  
* message.battle.ongoing  
* list  
    * song.admin.battle (leading)  
    * song.admin.battle (contender)  
* button.create-a-battle  
  
Songs should be listed from top voted to least voted from top to bottom. Create new battle button is visible but inactive in the sticky footer.   
[event.admin.live.battle.ongoing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3724&m=dev)  
  
### Battle ended  
Content:  
* message.battle.ended  
* list  
    * song.admin.battle (leading)  
    * song.admin.battle (contender)  
* button.create-a-battle  
  
Songs should be listed from top voted to least voted from top to bottom. Create new battle button is visible and active in the sticky footer. If the button is pressed, user is sent back to event.admin.live.battle page.  
[event.admin.live.battle.ended](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-5293&m=dev)  
#   
  
## Requests  
This tab lists all the song that have been requested from users since the event has been created.  
  
### No requests  
Content:  
* message.admin.live.no-requests  
* button.refresh  
  
When refresh button is pressed, list shows new requests made by users on the public page of the event if not sowing already.  
[event.admin.live.requests.no-requests](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3608&m=dev)  
  
### Requests added  
Content:  
* list  
    * song.admin.request  
* button.refresh  
  
Admin can mark the request as played by turning the toggle on at the right of a requested song card.  
This action will indicate that the requested song has been played on the users side by switching the icon.requests type to played.  
[event.admin.live.requests](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3546&m=dev)  
  
### Define a requested song as played  
Content:  
* list  
    * song.admin.request (played=yes)  
* button.refresh  
  
Admin can mark the request s played by turning the toggle on. Changes the card to [played=yes](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=867-2351&m=dev&t=rDkkbCrnTmkjETh6-1).  
This action will indicate that the requested song has been played on the users side by switching the icon.requests type to played.  
[event.admin.live.requests.song-played](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=982-5510&m=dev)  
  
### Select requested songs to create a battle  
Content:  
* list  
    * song.admin.request (selected)  
* button.refresh  
  
  
Admin need to select a minimum of 2 songs to a maximum of to 5 songs by tapping the song cards from the requested songs list to be able to create a new battle.  
The songs selected need to be non played requested songs.  
When the acceptance criteria are met, the footer shows an active button.create-a-battle button  
[event.admin.live.requests.create-a-battle](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3564&m=dev)  
  
If a battle made of selected request songs is submitted by pressing the button.create-a-battle button while a battle is already ongoing, the new battle is not created and an error message is shown.  
All song.admin.request cards reset to type=default and button to button.refresh.  
message.error disappears after 5 seconds.  
[event.admin.live.requests.battle-error](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3582&m=dev)  
  
## Messages  
This tab lists all messages sent from users through the message tab from the public event page.  
  
### No messages  
Content:  
* message.messages.live.no-messages  
* button.refresh  
[event.admin.live.messages.no-messages](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3758&m=dev)  
  
### Messages  
Content:  
* list  
    * admin.message  
* button.refresh  
  
The page displays a list of all messages from most recent to least recent.  
[event.admin.live.messages](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3772&m=dev)  
