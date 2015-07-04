function TouchToMouse(obj)
{
	function sqr(a)
	{
		return a * a;
	}
	
	var TouchObject = function()
	{
		return {
			screenStartX: 0,
			screenStartY: 0,
			screenX: 0,
			screenY: 0,
			clientStartX: 0,
			clientStartY: 0,
			clientX: 0,
			clientY: 0,
			view: null,
			target: null,
			active: false
		};
	};
	
	this.log = "";
	
	this.clickDistanceTreshold = 20;
	this.scrollDistanceTreshold = 60;
	this.scrollAmount = 120;
	this.onMouseDownCallback = null;
	this.onMouseUpCallback = null;
	this.onMouseMoveCallback = null;
	this.onClickCallback = null;
	this.onScrollCallback = null;
	
	this.mode = 0;
		// 0: nothing
		// 1: first finger down and not moved (much), click is possible
		// 2: mouse move
		// 3: more than one finger down, pinch mode
	this.touches = [];
	this.distance = 0;
	this.distance2 = 0;
	this.distanceDelta = 0;
	this.possibleClick = false;
	
	this.onMouseDownCallback = function(event, touch)
	{
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(
			"mousedown",      // in DOMString typeArg,
			true,             // in boolean canBubbleArg,
			true,             // in boolean cancelableArg,
			touch.view,       // in views::AbstractView viewArg,
			0,                // in long detailArg,
			touch.screenStartX,    // in long screenXArg,
			touch.screenStartY,    // in long screenYArg,
			touch.clientStartX,    // in long clientXArg,
			touch.clientStartY,    // in long clientYArg,
			0,                // in boolean ctrlKeyArg,
			0,                // in boolean altKeyArg,
			0,                // in boolean shiftKeyArg,
			0,                // in boolean metaKeyArg,
			0,                // in unsigned short buttonArg,
			null              // in EventTarget relatedTargetArg
		);
		
		touch.target.dispatchEvent(simulatedEvent);
	}
	
	this.onMouseUpCallback = function(event, touch)
	{
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(
			"mouseup",        // in DOMString typeArg,
			true,             // in boolean canBubbleArg,
			true,             // in boolean cancelableArg,
			touch.view,       // in views::AbstractView viewArg,
			0,                // in long detailArg,
			touch.screenX,    // in long screenXArg,
			touch.screenY,    // in long screenYArg,
			touch.clientX,    // in long clientXArg,
			touch.clientY,    // in long clientYArg,
			0,                // in boolean ctrlKeyArg,
			0,                // in boolean altKeyArg,
			0,                // in boolean shiftKeyArg,
			0,                // in boolean metaKeyArg,
			0,                // in unsigned short buttonArg,
			null              // in EventTarget relatedTargetArg
		);
		
		touch.target.dispatchEvent(simulatedEvent);
	}
	
	this.onMouseMoveCallback = function(event, touch)
	{
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(
			"mousemove",      // in DOMString typeArg,
			true,             // in boolean canBubbleArg,
			true,             // in boolean cancelableArg,
			touch.view,       // in views::AbstractView viewArg,
			0,                // in long detailArg,
			touch.screenX,    // in long screenXArg,
			touch.screenY,    // in long screenYArg,
			touch.clientX,    // in long clientXArg,
			touch.clientY,    // in long clientYArg,
			0,                // in boolean ctrlKeyArg,
			0,                // in boolean altKeyArg,
			0,                // in boolean shiftKeyArg,
			0,                // in boolean metaKeyArg,
			0,                // in unsigned short buttonArg,
			null              // in EventTarget relatedTargetArg
		);
		
		touch.target.dispatchEvent(simulatedEvent);
	}
	
	this.onClickCallback = function(event, touch)
	{
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(
			"click",          // in DOMString typeArg,
			true,             // in boolean canBubbleArg,
			true,             // in boolean cancelableArg,
			touch.view,       // in views::AbstractView viewArg,
			0,                // in long detailArg,
			touch.screenX,    // in long screenXArg,
			touch.screenY,    // in long screenYArg,
			touch.clientX,    // in long clientXArg,
			touch.clientY,    // in long clientYArg,
			0,                // in boolean ctrlKeyArg,
			0,                // in boolean altKeyArg,
			0,                // in boolean shiftKeyArg,
			0,                // in boolean metaKeyArg,
			0,                // in unsigned short buttonArg,
			null              // in EventTarget relatedTargetArg
		);
		
		touch.target.dispatchEvent(simulatedEvent);
	}
	
	this.onScrollCallback = function(event, touch, delta)
	{
		// this.log += "scroll " + delta + "<br/>";
		
		// thanks http://stackoverflow.com/a/6740625
		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initEvent(
			"mousewheel",     // in DOMString typeArg,
			true,             // in boolean canBubbleArg,
			true,             // in boolean cancelableArg,
			touch.view,       // in views::AbstractView viewArg,
			touch.screenX,    // in long screenXArg,
			touch.screenY,    // in long screenYArg,
			touch.clientX,    // in long clientXArg,
			touch.clientY,    // in long clientYArg,
			1,                // in unsigned short buttonArg,
			null,             // in EventTarget relatedTargetArg
			"",
			2,
			delta,
			1,
			0
		);
		simulatedEvent.wheelDelta = delta;
		touch.target.dispatchEvent(simulatedEvent);
	}
	
	for (i=0; i<10; i++)
	{
		this.touches[i] = new TouchObject();
	}
	
	this.onTouchEvent = function(event)
	{
		var i, j, a, b, s, d;
		
		s = "";
		
		event.preventDefault();
		
		for (i=0; i<10; i++)
		{
			a = event.touches[i];
			b = this.touches[i];
			
			if (!a)
			{
				if (i == 0 && b.active)
				{
					if (this.mode == 1)
					{
						if (this.possibleClick)
						{
							this.onMouseDownCallback(event, this.touches[0]);
							this.onMouseUpCallback(event, this.touches[0]);
							this.onClickCallback(event, this.touches[0]);
						}
					}
					else
					{
						this.onMouseUpCallback(event, this.touches[0]);
					}
				}
				
				b.active = false;
			}
			else
			{
				b.clientX = a.clientX;
				b.clientY = a.clientY;
				b.screenX = a.screenX;
				b.screenY = a.screenY;
				if (!b.active)
				{
					b.clientStartX = a.clientX;
					b.clientStartY = a.clientY;
					b.screenStartX = a.screenX;
					b.screenStartY = a.screenY;
					b.view = event.view;
					b.target = event.target;
					if (i == 0)
					{
						this.mode = 1;
						this.possibleClick = true;
					}
				}
				b.active = true;
				
			}
		}
		
		var validPinch = this.touches[0].active && this.touches[1].active;
		
		if (!validPinch)
		{
			if (this.mode == 0)
			{
				if (this.touches[0].active)
				{
					this.mode = 1;
				}
			}
			
			// "waiting"
			if (this.mode == 1)
			{
				// if the finger moved a lot, then it is a move not a click
				if (Math.sqrt(sqr(this.touches[0].screenX - this.touches[0].screenStartX) + sqr(this.touches[0].screenY - this.touches[0].screenStartY)) > this.clickDistanceTreshold)
				{
					this.possibleClick = false;
					this.mode = 2;
					
					this.onMouseDownCallback(event, this.touches[0]);
				}
			}
			
			if (this.mode == 2)
			{
				if (this.touches[0].screenStartX != this.touches[0].screenX || this.touches[0].screenStartY != this.touches[0].screenY)
				{
					this.onMouseMoveCallback(event, this.touches[0]);
				}
			}
			
			if (this.mode == 3)
			{
				// get back to one finger
				if (this.touches[0].active)
				{
					this.mode = 1;
				}
				else
				{
					this.mode = 0;
				}
				
				// reset the starting positions
				for (i=0; i<10; i++)
				{
					this.touches[i].screenStartX = this.touches[i].screenX;
					this.touches[i].screenStartY = this.touches[i].screenY;
					this.touches[i].clientStartX = this.touches[i].clientX;
					this.touches[i].clientStartY = this.touches[i].clientY;
				}
				
				this.distance2 = 0;
				this.distance = 0;
				this.distanceDelta = 0;
			}
		}
		else
		{
			if (this.mode == 1 || this.mode == 2)
			{
				// release the mouse button if it was pressed
				if (this.mode == 2)
				{
					this.onMouseDownCallback(event, this.touches[0]);
				}
				
				this.possibleClick = false;
				this.mode = 3;
				
				// reset the starting positions
				for (i=0; i<10; i++)
				{
					this.touches[i].screenStartX = this.touches[i].screenX;
					this.touches[i].screenStartY = this.touches[i].screenY;
					this.touches[i].clientStartX = this.touches[i].clientX;
					this.touches[i].clientStartY = this.touches[i].clientY;
				}
				
				this.distance2 = 0;
				this.distance = 0;
				this.distanceDelta = 0;
			}
			
			d = Math.sqrt(sqr(this.touches[0].screenX - this.touches[1].screenX) + sqr(this.touches[0].screenY - this.touches[1].screenY)) -
				Math.sqrt(sqr(this.touches[0].screenStartX - this.touches[1].screenStartX) + sqr(this.touches[0].screenStartY - this.touches[1].screenStartY));
			
			while (Math.abs(this.distanceDelta) > this.scrollDistanceTreshold)
			{
				if (this.distanceDelta < 0)
				{
					this.onScrollCallback(event, this.touches[0], this.scrollAmount);
					this.distanceDelta += this.scrollDistanceTreshold;
				}
				else
				{
					this.onScrollCallback(event, this.touches[0], - this.scrollAmount);
					this.distanceDelta -= this.scrollDistanceTreshold;
				}
			}
			
			this.distance2 = this.distance;
			this.distance = d;
			this.distanceDelta += (this.distance2 - this.distance);
		}
		
		if (!this.touches[0].active)
		{
			this.mode = 0;
		}
	}
	
	this.attach = function(obj)
	{
		obj.addEventListener("touchstart", this.onTouchEvent.bind(this), true);
		obj.addEventListener("touchmove", this.onTouchEvent.bind(this), true);
		obj.addEventListener("touchend", this.onTouchEvent.bind(this), true);
		obj.addEventListener("touchcancel", this.onTouchEvent.bind(this), true);
	}
	
	if (obj != null)
	{
		this.attach(obj);
	}
}
