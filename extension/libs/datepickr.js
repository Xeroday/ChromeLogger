/*
    datepickr - pick your date not your nose
    Copyright (c) 2012
*/

var datepickr = (function() {
	var datepickrs = [],
	currentDate = new Date(),
	date = {
		current: {
			year: function() {
				return currentDate.getFullYear();
			},
			month: {
				integer: function() {
					return currentDate.getMonth();
				},
				string: function(full, months) {
					var date = currentDate.getMonth();
					return monthToStr(date, full, months);
				}
			},
			day: function() {
				return currentDate.getDate();			
			}
		},
		month: {
			string: function(full, currentMonthView, months) {
				var date = currentMonthView;
				return monthToStr(date, full, months);
			},
			numDays: function(currentMonthView, currentYearView) {
				/* checks to see if february is a leap year otherwise return the respective # of days */
				return (currentMonthView == 1 && !(currentYearView & 3) && (currentYearView % 1e2 || !(currentYearView % 4e2))) ? 29 : daysInMonth[currentMonthView];
			}
		}
	},
	daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
	buildCache = [],
	handlers = {
		calendarClick: function(e) {
			if(e.target.className) {
				switch(e.target.className) {
					case 'prev-month':
					case 'prevMonth':
						this.currentMonthView--;
						if(this.currentMonthView < 0) {
							this.currentYearView--;
							this.currentMonthView = 11;
						}
						rebuildCalendar.call(this);
					break;
					case 'next-month':
					case 'nextMonth':
						this.currentMonthView++;
						if(this.currentMonthView > 11) {
							this.currentYearView++;
							this.currentMonthView = 0;
						}
						rebuildCalendar.call(this);
					break;
					case 'day':
						this.element.value = formatDate(new Date(this.currentYearView, this.currentMonthView, e.target.innerHTML).getTime(), this.config);
						this.close();
					break;
				}
			}
		},
		documentClick: function(e) {
			if(e.target != this.element && e.target != this.calendar) {
				var parentNode = e.target.parentNode;
				if(parentNode != this.calender) {
					while(parentNode != this.calendar) {
						parentNode = parentNode.parentNode;
						if(parentNode == null) {
							this.close();
							break;
						}
					}
				}
			}
		}
	};
	
	function formatDate(milliseconds, config) {
		var formattedDate = '',
		dateObj = new Date(milliseconds),
		format = {
			d: function() {
				var day = format.j();
				return (day < 10) ? '0' + day : day;
			},
			D: function() {
				return config.weekdays[format.w()].substring(0, 3);
			},
			j: function() {
				return dateObj.getDate();
			},
			l: function() {
				return config.weekdays[format.w()];
			},
			S: function() {
				return config.suffix[format.j()] || config.defaultSuffix;
			},
			w: function() {
				return dateObj.getDay();
			},
			F: function() {
				return monthToStr(format.n(), true, config.months);
			},
			m: function() {
				var month = format.n() + 1;
				return (month < 10) ? '0' + month : month;
			},
			M: function() {
				return monthToStr(format.n(), false, config.months);
			},
			n: function() {
				return dateObj.getMonth();
			},
			Y: function() {
				return dateObj.getFullYear();
			},
			y: function() {
				return format.Y().toString().substring(2, 4);
			}
		},
		formatPieces = config.dateFormat.split('');
		
		foreach(formatPieces, function(formatPiece, index) {
			if(format[formatPiece] && formatPieces[index - 1] != '\\') {
				formattedDate += format[formatPiece]();
			} else {
				if(formatPiece != '\\') {
					formattedDate += formatPiece;
				}
			}
		});
		
		return formattedDate;
	}
	
	function foreach(items, callback) {
		var i = 0, x = items.length;
		for(i; i < x; i++) {
			if(callback(items[i], i) === false) {
				break;
			}
		}
	}
	
	function addEvent(element, eventType, callback) {
		if(element.addEventListener) {
			element.addEventListener(eventType, callback, false);
		} else if(element.attachEvent) {
			var fixedCallback = function(e) {
				e = e || window.event;
				e.preventDefault = (function(e) {
					return function() { e.returnValue = false; }
				})(e);
				e.stopPropagation = (function(e) {
					return function() { e.cancelBubble = true; }
				})(e);
				e.target = e.srcElement;
				callback.call(element, e);
			};
			element.attachEvent('on' + eventType, fixedCallback);
		}
	}
	
	function removeEvent(element, eventType, callback) {
		if(element.removeEventListener) {
			element.removeEventListener(eventType, callback, false);
		} else if(element.detachEvent) {
			element.detachEvent('on' + eventType, callback);
		}
	}
	
	function buildNode(nodeName, attributes, content) {
		var element;
		
		if(!(nodeName in buildCache)) {
			buildCache[nodeName] = document.createElement(nodeName);
		}
		
		element = buildCache[nodeName].cloneNode(false);
		
		if(attributes != null) {
			for(var attribute in attributes) {
				element[attribute] = attributes[attribute];
			}
		}
		
		if(content != null) {
			if(typeof(content) == 'object') {
				element.appendChild(content);
			} else {
				element.innerHTML = content;
			}
		}
		
		return element;
	}
	
	function monthToStr(date, full, months) {
		return ((full == true) ? months[date] : ((months[date].length > 3) ? months[date].substring(0, 3) : months[date]));
	}
	
	function isToday(day, currentMonthView, currentYearView) {
		return day == date.current.day() && currentMonthView == date.current.month.integer() && currentYearView == date.current.year();
	}
	
	function buildWeekdays(weekdays) {
		var weekdayHtml = document.createDocumentFragment();
		foreach(weekdays, function(weekday) {
			weekdayHtml.appendChild(buildNode('th', {}, weekday.substring(0, 2)));
		});
		return weekdayHtml;
	}
	
	function rebuildCalendar() {
		while(this.calendarBody.hasChildNodes()){
			this.calendarBody.removeChild(this.calendarBody.lastChild);
		}
		
		var firstOfMonth = new Date(this.currentYearView, this.currentMonthView, 1).getDay(),
		numDays = date.month.numDays(this.currentMonthView, this.currentYearView);
		
		this.currentMonth.innerHTML = date.month.string(this.config.fullCurrentMonth, this.currentMonthView, this.config.months) + ' ' + this.currentYearView;
		this.calendarBody.appendChild(buildDays(firstOfMonth, numDays, this.currentMonthView, this.currentYearView));
	}
	
	function buildCurrentMonth(config, currentMonthView, currentYearView, months) {
		return buildNode('span', { className: 'current-month' }, date.month.string(config.fullCurrentMonth, currentMonthView, months) + ' ' + currentYearView);
	}
	
	function buildMonths(config, currentMonthView, currentYearView) {
		var months = buildNode('div', { className: 'months' }),
		prevMonth = buildNode('span', { className: 'prev-month' }, buildNode('span', { className: 'prevMonth' }, '&lt;')),
		nextMonth = buildNode('span', { className: 'next-month' }, buildNode('span', { className: 'nextMonth' }, '&gt;'));
		
		months.appendChild(prevMonth);
		months.appendChild(nextMonth);
		
		return months;
	}
	
	function buildDays(firstOfMonth, numDays, currentMonthView, currentYearView) {
		var calendarBody = document.createDocumentFragment(),
		row = buildNode('tr'),
		dayCount = 0, i;
		
		/* print out previous month's "days" */
		for(i = 1; i <= firstOfMonth; i++) {
			row.appendChild(buildNode('td', null, '&nbsp;'));
			dayCount++;
		}
		
		for(i = 1; i <= numDays; i++) {
			/* if we have reached the end of a week, wrap to the next line */
			if(dayCount == 7) {
				calendarBody.appendChild(row);
				row = buildNode('tr');
				dayCount = 0;
			}
			
			var todayClassName = isToday(i, currentMonthView, currentYearView) ? { className: 'today' } : null;
			row.appendChild(buildNode('td', todayClassName, buildNode('span', { className: 'day' }, i)));
			
			dayCount++;
		}
		
		/* if we haven't finished at the end of the week, start writing out the "days" for the next month */
		for(i = 1; i <= (7 - dayCount); i++) {
			row.appendChild(buildNode('td', null, '&nbsp;'));
		}
		
		calendarBody.appendChild(row);
		
		return calendarBody;
	}
	
	function buildCalendar() {
		var firstOfMonth = new Date(this.currentYearView, this.currentMonthView, 1).getDay(),
		numDays = date.month.numDays(this.currentMonthView, this.currentYearView),
		self = this;
		
		var inputLeft = inputTop = 0,
		obj = this.element;
		
		if(obj.offsetParent) {
			do {
				inputLeft += obj.offsetLeft;
				inputTop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		
		var calendarContainer = buildNode('div', { className: 'calendar' });
		calendarContainer.style.cssText = 'display: none; position: absolute; top: ' + (inputTop + this.element.offsetHeight) + 'px; left: ' + inputLeft + 'px; z-index: 100;';
		
		this.currentMonth = buildCurrentMonth(this.config, this.currentMonthView, this.currentYearView, this.config.months)
		var months = buildMonths(this.config, this.currentMonthView, this.currentYearView);
		months.appendChild(this.currentMonth);
		
		var calendar = buildNode('table', null, buildNode('thead', null, buildNode('tr', { className: 'weekdays' }, buildWeekdays(this.config.weekdays))));
		this.calendarBody = buildNode('tbody');
		this.calendarBody.appendChild(buildDays(firstOfMonth, numDays, this.currentMonthView, this.currentYearView));
		calendar.appendChild(this.calendarBody);
		
		calendarContainer.appendChild(months);
		calendarContainer.appendChild(calendar);
		
		document.body.appendChild(calendarContainer);
		
		addEvent(calendarContainer, 'click', function(e) { handlers.calendarClick.call(self, e); });
		
		return calendarContainer;
	}
	
	return function(elementId, userConfig) {
		var self = this;
		
		this.element = document.getElementById(elementId);
		this.config = {
			fullCurrentMonth: true,
			dateFormat: 'F jS, Y',
			weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			suffix: { 1: 'st', 2: 'nd', 3: 'rd', 21: 'st', 22: 'nd', 23: 'rd', 31: 'st' },
			defaultSuffix: 'th'
		};
		this.currentYearView = date.current.year();
		this.currentMonthView = date.current.month.integer();
		
		if(userConfig) {
			for(var key in userConfig) {
				if(this.config.hasOwnProperty(key)) {
					this.config[key] = userConfig[key];
				}
			}
		}
		
		this.documentClick = function(e) { handlers.documentClick.call(self, e); }
		
		this.open = function(e) {
			addEvent(document, 'click', self.documentClick);
			
			foreach(datepickrs, function(datepickr) {
				if(datepickr != self) {
					datepickr.close();
				}
			});
			
			self.calendar.style.display = 'block';
		}
		
		this.close = function() {
			removeEvent(document, 'click', self.documentClick);
			self.calendar.style.display = 'none';
		}
		
		this.calendar = buildCalendar.call(this);
		
		datepickrs.push(this);
		
		if(this.element.nodeName == 'INPUT') {
			addEvent(this.element, 'focus', this.open);
		} else {
			addEvent(this.element, 'click', this.open);
		}
	}
})();

new datepickr('picker', {'dateFormat': 'M j, Y'});