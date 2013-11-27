(function(){
	var Inception = window.Inception = {

		socket : null,
		identifier: null,
		iframe: null,
		send : null,
		local : null,
		target: null,
		window : window,

		_construct : function(params){
			if (params.level == "top" && window == window.top) Inception.top(params); 
			else if (params.level== "child") Inception.child(params);
			else if (params.level== "channel") Inception.channel(params);


			//// if page's get params, use them
			var getParams = Inception.get(window.location.href); 
			if (getParams.length) Inception.command(getParams.value);
		},

		_event : function(element,event,listener){
			if(element.addEventListener) {
			 	element.addEventListener(event, listener, false);
			}
			else {
				 element.attachEvent("on" + event, listener);
			}
		},

		get : function(path){

			var ret = {};
			if (path.indexOf('?') > -1) {
				var uri = path.substring((path.indexOf('?') + 1),path.length);
				var split = uri.split('&');
				var hasVals = false;
				for(var i =0; i<split.length; i++){
					var vals = split[i].split('='); 
					ret[vals[0]] = vals[1]; 
					hasVals = true; 
				}
				return {length: split.length, value: ret}; 
			}	 
			else return {length: 0, value:ret} 
			
		},

		setSocket : function(socket){
			Inception.socket = socket; 
		},

		createFrame: function(url){
			Inception.iframe = document.createElement("iframe"); 
			Inception.iframe.src = url;
			Inception.iframe.width='1px';
			Inception.iframe.height='1px';
			Inception.iframe.style.position="absolute"
			Inception.iframe.style.left="-100px"
			Inception.iframe.style.top="-100px"
			return Inception.iframe;
		},

		top : function(params){
			Inception.identifier = window.location.href;
			Inception.send = Inception.bubbleDown;
		},

		child : function(params){
			Inception.identifier = window.location.href;
			//window.Inception = Inception.bubbleUp;
			if(params.target) {
				Inception.target = params.target;
				Inception.iframe = Inception.createFrame(params.target); 
				document.body.appendChild(Inception.iframe);
			}
			Inception.send = Inception.bubbleFrame;
		},

		channel: function(params){
			Inception.identifier = window.location.href;
			if(params.target) {
				Inception.target = params.target;
				Inception.iframe = Inception.createFrame(params.target)
				document.body.appendChild(Inception.iframe);

				Inception.send = Inception.bubbleOne;
			}
			else {	
				Inception.send = Inception.bubbleUp;
			}

			window.parent.parent.window.Inception.setSocket(Inception); 
		},

		bubbleUp : function(params){
			window.parent.parent.Inception.command(params);
		},

		bubbleDown: function(params){
			params.command='bubbleUp'; 
			params.next=false;
			Inception.socket.send(params)
		}, 

		bubbleFrame: function(params){
			params.command='bubbleUp'; 
			params.next=false;
			Inception.bubbleOne(params)
		}, 

		bubbleOne: function(params){
			params.level = 'channel'; 
			if (Inception.target) params.target = Inception.target;
			Inception.iframe.src=Inception.target + '?' + Inception.convert(params);
		},

		convert: function(params){
			var arr = []; 
			for(var a in params) {
				arr.push(a + '=' + params[a]); 
			}
			return arr.join("&");
		},

		log: function(params){
			console.log(['log',params]);
		},

		command: function(params){
			if (params.command && params.command !== "false") {
				key = params.command;
				if (typeof params.next !== 'undefined') {

					params.command=params.next;
					params.next=false;
				}

				Inception[key](params);
			}
			else {
			
				if (params.execute) {
				window[params.execute](params);
				}
				//else Inception.send(params);
			}
		}


	}
})();