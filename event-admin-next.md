# event-admin-next  
  
## Description  
An admin event allows the dj to manage the event info. The dj is able to see messages and requests sent from the users.  
  
An event has its own specific URL.  
  
## Header  
* button.back  
* event.status (next)  
* event.thumbnail  
##   
## Tabs  
* Info  
* Playing  
* Battle  
* Requests  
* Messages  
  
## Info  
This tab is dedicated to edit the info, image and links describing the event.  
  
> The mandatory fields defined and now applied do not change.  
  
DJ can edit event info once the event has ben created. Changes are applied only if Save button is pressed.  
  
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
* Delete button  
[event-admin-info.phone](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-3516&m=dev)  
  
DJ can delete the event if Delete button is pressed and confirmed in the confirmation popup. Use the browser’s confirmation popup process for this step.  
  
  
## Playing  
In the case of an event that has not started yet, only a message will be shown.  
  
Content:  
* message.admin.next.nothing-played  
  
[event.admin.next.playing](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-5978&m=dev)  
  
  
## Battle  
In the case of an event that has not started yet, only a message will be shown.  
  
Content:  
* message.admin.next.no-battle  
  
[admin.event.next.battle](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-6054&m=dev)  
  
  
  
## Requests  
This tab lists all the song that have been requested since the event has been created.  
  
> The functionality rules created and now applied do not change.  
  
### No requests made  
In the case of an event that has not started yet and no requests have been submitted yet, only a message will be shown.  
  
Content:  
* message.admin.next.no-requests  
* button.refresh  
  
Pressing the refresh button verifies if any requests have been made on the public side of the event. If some requests have been made since, the page changes to request submitted.  
  
[admin.event.next.no-requests](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-6173&m=dev)  
  
### Requests submitted  
When an event has not started yet but some requests have been submitted, dj is shown all request song cards in a list. Most recent request cited at the top to least recent request at the bottom.  
Dj can remove a request from the list by tapping on the X red icon on the right of a requested song card.  
  
Content:  
* list  
    * song.admin.request (next)  
* button.refresh  
  
[admin.event.next.requests](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-6188&m=dev)  
  
## Messages  
This tab displays all messages sent from users through the “Message” tab from the same event.  
  
### No messages  
No messages were sent from users throughout the public event page yet.  
  
Content:  
* admin.event.next.messages.message  
* button.refresh  
  
Pressing the refresh button verifies if any messages have been sent on the public side of the event. If some messages have been sent since, the page changes to message sent.  
  
[admin.event.next.messages.no-messages](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-6431&m=dev)  
  
### Messages sent  
The page displays a list of all messages from most recent to least recent from top to bottom. Messages are listed from most recent at the top to least recent at the bottom.  
  
Content:  
* list  
    * admin.message  
* button.refresh  
  
Pressing the refresh button verifies if any messages have been sent on the public side of the event. If some messages have been sent since, they are added to the top of the list in most recent been above.  
  
[admin.event.next.messages-sent](https://www.figma.com/design/jLKivsLOR22DJmngjsCcYz/Momo-Aux-Platines?node-id=972-6445&m=dev)  
