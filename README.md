# Mdx Inception 
Iframe handshaking for safe cross domain communications
Uses iframes within iframes for communication (inception frames) 

# Features
* Allows for parent-child communication between iframes in different domains
* Bubble events go straight up/down to allow for multiple levels of communication
* Gives a method for executing level specific functions with parameters
* Two way communications between parent/child frames 
* A single JS include at every level handles the details. 

# Working demo 
http://mdx-dev.github.io/inception/index.html

# Implementing
The way inception works is thru the use of "channels" that exist
on the different levels of domains being tied together. 

On each domain, the pages being displayed will have access to a channel on their domains. 
Each domain will use the other domain's channel as the communication portal. 
The channels then bubble up the message to the appropriate level. 

# Example
	domain: abcdef.com 
		* index.html (topLevel)
			* function TopLevelFunction(param) { alert(param.OtherMessage) }
		* channel.html (channelA) 

	domain bcdef.com 

	* index.html (iframe) 
		* function ChildFunction(param) { alert(param.MyMessage) }
	* channel.html (channelB) 

	* config
		* topLevel - 	{type: top, target: channelB} 
		* iframe 	 - 	{type:child, target: channelA}
		* channelA - 	{type: channel, target: channelB}
		* channelB - 	{type:channel}

# Message Trail
	
Message from topLevel to iframe routes as such
	
	topLevel : Inception.send({execute:'ChildFunction', MyMessage:"some text"})
		-> targets ChannelB (on bcdef.com) passes json 
		 	-> ChannelB recieved message, bubbles up to IFrame 
		 		-> Iframe receives message from ChannelB and executes 

	iframe : Inception.send({execute:'TopLevelFunction', MyMessage:"some text"})
		-> targets ChannelA (on abcdef.com) passes json 
			-> ChannelA recieved message, bubbles up to topLevel
				-> Toplevel recieves message from ChannelA and executes 

# Channels
On loads, the channels register themselves into their appropriate parent to allow access for message sending. 


# Getting Started
Clone the repo down to a web server that can handle the PHP library and .htaccess (if you want to call .js instead of .php) 
visit http://yourserver/inception/example/toplevel/ 

The example will work the same way as if it were with different domains, the channels must exist on the different domains you 
want to pair, but the inception library can be used as a single source. 

Simply change the URL source of the channels, point each target to the correct channel 

Question or Comments simply ask. 

Thanks

Rulian - Mdx Devopment : Mdx Medical 