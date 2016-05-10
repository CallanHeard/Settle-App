/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app many system logic/scripts
*/

	var server		= 'http://localhost/csc3122/';	//Back-end server location
	var handle		= 'handle.php?';				//Handler file name
	var profiles	= 'profiles/';					//Profile images directory name
	
	var id;			//Current user ID
	var user;		//Current user
	var payments;	//Current user's payments
	
	var currentHeading = 0; //Starting page overview heading
	
	var checkOffSet = 'off'; //Used on payment page, checkOff function
	
	var blue	= '#3366BB'; //Blue CSS colour
	var green	= '#66CD00'; //Green CSS colour
	var black	= '#000000'; //Black CSS colour (standard black hex)

	/*
	 * load function for retrieving page content from database
	 */
	function load(top, nav) {

		id = getParam('id'); //Get user ID

		//If ID is present
		if (id != null && id != '') {

			//Get user details
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			xmlhttp.onreadystatechange = function() {
			
				//Once request is complete
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					user = new User(JSON.parse(xmlhttp.responseText)); //Instantiate user object from JSON response
				}
				
			};
			
			xmlhttp.open('GET', server + handle + 'user=' + id, false);	//Specify AJAX request
			xmlhttp.send();												//And send

			//If page requires topbar
			if (top) {
				topbar(top); //Add topbar to page
			}
			
			//If page required sidebar
			if (nav) {
				sidebar(nav); //Add sidebar to page
			}
			
		}
		//Else, TODO handle error
		else {
			window.location = 'index.html'; //Return to login page
		}

	}

	/*
	 * getParam function for retrieving a query parameter from the URL string
	 * Source: http://stackoverflow.com/a/901144/2030247
	 */
	function getParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	/*
	 * topbar function for adding navigational topbar to page
	 */
	function topbar(title) {
		
		//Generate markup
		var markup = '<!-- Page top bar -->\
<div id="topbar" class="clear">\
<i onclick="toggleNav();" class="fa fa-bars" aria-hidden="true"></i> <!-- Show nav overlay button -->\
<h1>' + title + '</h1> <!-- Main page title --></div>';
		
		document.body.innerHTML = markup + document.body.innerHTML; //Append markup to page
		
	}
	
	/*
	 * Adds back button to topbar
	 * TODO buggy atm and not being used - reloading pages in places (such as payment) and causes back button to not work
	 */
	function topbarBack() {
		/* TODO add after nav button, not before */
		document.getElementById('topbar').innerHTML = '<i onclick="window.history.back();" class="fa fa-chevron-left" aria-hidden="true"></i>' + document.getElementById('topbar').innerHTML;
	}
	
	/*
	 * sidebar function for adding navigational sidebar to page
	 */
	function sidebar(selected) {

		var notifications;
	
		//Look for notifications
		xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
		
		//Handle various callbacks from request
		xmlhttp.onreadystatechange = function() {
		
			//Once request is complete
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				notifications = parseInt(JSON.parse(xmlhttp.responseText)['total']); //Get response and parse to integer
			}
			
		};
		
		xmlhttp.open('GET', server + handle + 'checkNotifications=' + id, false);	//Specify AJAX request
		xmlhttp.send();																//And send

		//Generate markup
		var markup = '<!-- Page navigation -->\
<div id="sidebar" style="display: none">\
<div class="overlay" onclick="toggleNav();"></div>\
<ul>\
<li>' + user.displayProfile() + '</li>\
<li><a href="dashboard.html?id=' + id + '"' + (selected == 'dashboard' ? ' class="selected"' : '') + '>Dashboard<i class="fa fa-home" aria-hidden="true"></i></a></li>\
<li><a href="notifications.html?id=' + id + '"' + (selected == 'notifications' ? ' class="selected"' : '') + '>Notifications' + (notifications > 0 ? ' (' + notifications + ')' : '') + '<i class="fa fa-flag"' + (notifications > 0 ? ' style="color: #3366BB"' : '') + ' aria-hidden="true"></i></a></li>\
<li><a href="create_payment.html?id=' + id + '"' + (selected == 'payment' ? ' class="selected"' : '') + '>New Payment<i class="fa fa-plus" aria-hidden="true"></i></a></li>\
<li class="split"><a href="#">Account<i class="fa fa-wrench" aria-hidden="true"></i></a></li>\
<li><a href="#">Help<i class="fa fa-info" aria-hidden="true"></i></a></li>\
</ul>\
</div>';
		
		document.body.innerHTML += markup; //Append markup to page
		
	}
	
	/*
	 * toggleNav function for showing/hiding sidebar
	 */
	function toggleNav() {
		
		var value = document.getElementById('sidebar').style.display; //Get sidebar visibility
		
		//If sidebar is hidden
		if (value == 'none') {
			
			document.getElementById('sidebar').style.display = 'block'; //Display whole sidebar
			
			var side = document.getElementById('sidebar').getElementsByTagName('ul')[0];	//Get sidebar menu list element
			var left = -76;																	//Starting left position of menu
			
			//Set interval (1ms) for menu slider function
			var interval = setInterval(
				
				//Menu slider function
				function() {
					
					//If slider complete
					if (left == 0) {
						clearInterval(interval); //Clear interval
					}
					//Else, slide menu
					else {
						
						left = left + 1;					//Increment left position
						side.style.marginLeft = left + '%';	//Set new left position of menu
						
					}
					
				},
				
			1);
			
		}
		//Else, sidebar is visible
		else {
			
			var side = document.getElementById('sidebar').getElementsByTagName('ul')[0];	//Get sidebar menu list element
			var left = 0;																	//Starting left position of menu
			
			//Set interval (1ms) for menu slider function
			var interval = setInterval(
				
				//Menu slider function
				function() {
					
					//If slider complete
					if (left == -75) {
						
						document.getElementById('sidebar').style.display = 'none';	//Hide sidebar
						clearInterval(interval);									//Clear interval
						
					}
					//Else, slide menu
					else {
						
						left = left - 1;					//Decrement left position
						side.style.marginLeft = left + '%';	//Set new left position of menu
						
					}
					
				},
				
			1);
			
		}
		
		
	}
	
	/*
	 * toggleHeading function for switching between displayed page overview headings
	 */
	function toggleHeading(heading) {
		
		var headings = document.getElementById('totals').getElementsByTagName('div'); //Get page overview headings
		
		heading.removeAttribute('class');													//Hide previous heading
		currentHeading = currentHeading == headings.length - 1 ? 0 : currentHeading + 1;	//Loop pointer through overview headings														//Loop through dashboard heading numbers
		headings[currentHeading].setAttribute('class', 'selected');							//Show new dashboard heading
		
	}
	
	/*
	 * dashboard function for loading dashboard page content
	 */
	function dashboard() {
		
		//Get all user payments
		xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
		
		//Handle various callbacks from request
		xmlhttp.onreadystatechange = function() {
		
			//Once request is complete
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				//If there is a response
				if (xmlhttp.responseText != '') {
				
					payments = JSON.parse(xmlhttp.responseText); //Parse response
					
					//Convert parsed JSON objects into Payment objects
					for (var i in payments) {
					
						payments[i] = new Payment(payments[i]); //Create new Payment object from JSON
						
						document.getElementById(payments[i].orientation).style.display = 'block';									//Show list heading
						document.getElementById(payments[i].orientation).getElementsByTagName('ul')[0].innerHTML += payments[i];	//Add Payment to page
					
					}
					
				}
				
			}
			
		};
		
		xmlhttp.open('GET', server + handle + 'payments=' + id, false);	//Specify AJAX request
		xmlhttp.send();													//And send
		
		//Update new payment link with user ID
		document.getElementById('overview').getElementsByTagName('a')[0].href = document.getElementById('overview').getElementsByTagName('a')[0].href + '?id=' + id;
		
		//If there are no payments
		if (document.getElementById('owes').style.display == '' && document.getElementById('owed').style.display == '') {
			document.body.innerHTML += '<p>No payments found!<br /><br />Click the plus button above to create one, or use your PIN to join someone else\'s</p>';
		}
		
		//Calculate page overview heading totals
		var balance	= 0;
		var owes	= 0;
		var owed	= 0;
		
		//For each payment in payments
		for (var i in payments) {
			
			balance	+= payments[i].orientation == 'owes' ? -payments[i].amount : payments[i].total;	//Update balance
			owes	+= payments[i].orientation == 'owes' ? payments[i].amount : 0;					//Update owes
			owed	+= payments[i].orientation == 'owed' ? payments[i].total : 0;					//Update owed
			
		}
		
		/* TODO responsive total value size */
		
		//Set balance heading/total
		document.getElementById('balance_total').innerHTML = parseFloat(Math.round(Math.abs(balance) * 100) / 100).toFixed(2);						//Set balance value, formatted two decimal places
		document.getElementById('balance_total').setAttribute('class', 'selected' + (balance < 0 ? ' red' : '') + (balance > 0 ? ' green' : ''));	//Set balance colour
		
		document.getElementById('owes_total').innerHTML = parseFloat(Math.round(Math.abs(owes) * 100) / 100).toFixed(2);	//Set owes value, formatted two decimal places
		document.getElementById('owes_total').setAttribute('class', (owes > 0 ? 'red' : 'green'));							//Set owes colour
		
		document.getElementById('owed_total').innerHTML = parseFloat(Math.round(Math.abs(owed) * 100) / 100).toFixed(2);	//Set owed value, formatted two decimal places
		if (owed > 0) document.getElementById('owed_total').setAttribute('class', 'green');									//Set owed colour
		
		document.getElementById('totals').getElementsByTagName('div')[currentHeading].setAttribute('class', 'selected'); //Show starting page overview heading
		
	}
	
	/*
	 * payment function for loading view payment page content
	 */
	function payment() {
		
		//topbarBack(); //Add back button

		var payment_id = getParam('payment'); //Get payment ID
		
		var complete; //Where the payment is complete

		//If payment ID is present
		if (payment_id != null && payment_id != '') {
		
			//Get single payment
			payment_request = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			payment_request.onreadystatechange = function() {
			
				//Once request is complete
				if (payment_request.readyState == 4 && payment_request.status == 200) {
					
					var payment = JSON.parse(payment_request.responseText); //Parse response
					
					//Parse response again to create host user
					var host = JSON.parse(payment_request.responseText);	//(Little bit convoluted but really helpful)
					host.id = payment.host_user;							//Update host id before initialising
					host = new User(host);									//Initialise host as User object
					
					complete = payment.total == 0; //Set payment complete status
					
					//Load page content
					document.title = payment.name + ' ' + document.title;										//Update page title
					document.getElementById('topbar').getElementsByTagName('h1')[0].innerHTML = payment.name;	//Update page heading
					
					//Check if notification already exists
					notifyCheck = new XMLHttpRequest(); //Create new AJAX request object
					
					//Handle various callbacks from request
					notifyCheck.onreadystatechange = function() {
					
						//Once request is complete
						if (notifyCheck.readyState == 4 &&notifyCheck.status == 200) {
							complete = notifyCheck.responseText; //Prevent notification link
						}
						
					}
		
					notifyCheck.open('GET', server + handle + 'checkNotify=' + user.id + '&pid=' + getParam('payment'), false);	//Specify AJAX request
					notifyCheck.send();																							//And send
					
					//Generate appropriate overview link for incoming/outgoing payment (very long!)
					var overviewLink = payment.host_user == id ? '<a href="javascript: ' + (complete ? 'alert(\'Payment Complete!\')' : 'checkOff(\'on\')') + ';"' + (complete ? ' style="color: ' + green + '"' : '') + '><i class="fa fa-check-square-o" aria-hidden="true"></i></a>' : (complete ? '<a><i class="green fa fa-check-square-o" aria-hidden="true"></i></a>' : '<a href="javascript: notify();" style="font-size: 40px;"><i class="fa fa-bell-o" aria-hidden="true"></i></a>');
					document.getElementById('overview').innerHTML = overviewLink + document.getElementById('overview').innerHTML;	//Add link to overview section
					
					document.getElementById('details').innerHTML = host;									//Add host details to details section
					document.getElementById('details').innerHTML += '<p>' + payment.description + '</p>';	//Add payment description to details section
					
				}
				
			};
			
			payment_request.open('GET', server + handle + 'payment=' + payment_id, false);	//Specify AJAX request
			payment_request.send();															//And send
			
			//Get payment contributors
			members_request = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			members_request.onreadystatechange = function() {
			
				//Once request is complete
				if (members_request.readyState == 4 && members_request.status == 200) {
					
					members = JSON.parse(members_request.responseText); //Parse response
	
					//Calculate page overview heading totals
					var total		= 0;
					var remaining	= 0;
					var paid		= 0;
	
					//Convert parsed JSON objects into User objects
					for (var i in members) {
					
						members[i] = new User(members[i]); //Create new User object from JSON
						
						//Add contributor to list on page
						document.getElementById('members').innerHTML += '<li' + (members[i].settled == 0 ? ' onclick="paid(' + members[i].id + ', \'' + members[i].fullName + '\')"' : '') + '>' + members[i] + '<hr /></li>';
						
						total += members[i].amount; //Add amount to total payment
						
						//If payment is paid
						if (members[i].settled == 1) {
							paid += members[i].amount; //Add amount to total paid
						}
						//Else payment not paid
						else {
							remaining += members[i].amount; //Add amount to total remaining
						}
						
					}
					
					document.getElementById('total_total').innerHTML = parseFloat(Math.round(Math.abs(total) * 100) / 100).toFixed(2); //Update payment total heading value
					
					document.getElementById('paid_total').innerHTML = parseFloat(Math.round(Math.abs(paid) * 100) / 100).toFixed(2);	//Set paid value, formatted two decimal places
					document.getElementById('paid_total').setAttribute('class', (paid > 0 ? 'green' : 'red'));							//Set owes colour
					
					document.getElementById('remaining_total').innerHTML = parseFloat(Math.round(Math.abs(remaining) * 100) / 100).toFixed(2);	//Set remaining value, formatted two decimal places
					document.getElementById('remaining_total').setAttribute('class', (remaining > 0 ? 'red' : 'green'));						//Set owes colour
					
				}
				
			};
			
			members_request.open('GET', server + handle + 'contributors=' + payment_id, false);	//Specify AJAX request
			members_request.send();																//And send
			
			if (!complete && window.location.hash == '#checkOff') checkOff('on'); //If already checking-off, go back to that state
			
		}
		//Else, TODO handle error
		else {
			window.location = 'dashboard.html?id=' + id; //Return to dashboard
		}
	
	}
	
	/*
	 * notify function for notifying a payment host that a user has paid
	 */
	function notify() {
		
		//Confirm action
		if (confirm('Notify the host that you have paid them?')) {
		
			//Create notification
			xmlhttp = new XMLHttpRequest();																		//Create new AJAX request object
			xmlhttp.open('GET', server + handle + 'notify=' + user.id + '&pid=' + getParam('payment'), false);	//Specify AJAX request
			xmlhttp.send();																						//And send
		
			window.location.reload(); //Reload page to show updated information
		
		}
				
	}
	
	/*
	 * checkOff function for switching checkOffSet value
	 */
	function checkOff(set) {
		
		//Switch on input value
		switch (set) {
			
			//Input is on
			case 'on':
				document.getElementById('overview').getElementsByTagName('a')[0].setAttribute('href', 'javascript: checkOff(\'off\');');	//Set button to input off
				document.getElementById('overview').getElementsByTagName('a')[0].style.color = blue;										//Change colour of button
				
				var members = document.getElementById('members').getElementsByTagName('li'); //Get members
				
				//Loop through members
				for (var i = 0; i < members.length; i++) {
					
					//If contributor has not paid
					if (members[i].getElementsByClassName('amount')[0].classList.contains('red')) {
						members[i].getElementsByClassName('details')[0].style.color = blue; //Set text colour to blue
					}
					
				}
				
				break;
			
			//Input is off
			case 'off':
				document.getElementById('overview').getElementsByTagName('a')[0].setAttribute('href', 'javascript: checkOff(\'on\');');	//Set button to input off
				document.getElementById('overview').getElementsByTagName('a')[0].style.color = black;									//Change colour of button
				
				var members = document.getElementById('members').getElementsByTagName('li'); //Get members
				
				//Loop through members
				for (var i = 0; i < members.length; i++) {
					members[i].getElementsByClassName('details')[0].style.color = black; //Set text colour to black
				}
				
				break;
			
		}
		
		checkOffSet = set; //Update checkOffSet value
		
	}
	
	/*
	 * paid function for specifying a payment contributor has paid
	 */
	function paid(contributor_id, name) {
	
		//If in 'check off' mode
		if (checkOffSet == 'on') {
			
			//Confirm action
			if (confirm('Confirm ' + name + ' has paid you?')) {
				
				//Handle user paid
				xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
				
				//Handle various callbacks from request
				xmlhttp.onreadystatechange = function() {
				
					//Once request is complete
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						
						//Maintain checking-off state
						if (window.location.hash != '#checkOff') {
							window.location = window.location + '#checkOff';
						}
						
						window.location.reload(); //Reload page to show updated information
						
					}
					
				}
				
				xmlhttp.open('GET', server + handle + 'paid=' + getParam('payment') + '&contributor=' + contributor_id, false);	//Specify AJAX request
				xmlhttp.send();																									//And send
				
			}
			
		}
	
	}
	
	/*
	 * newMember function for showing/hiding the new member input on a new payment
	 */
	function newMember(button) {
		
		var input = document.getElementById('newMember'); //Get new member input
		
		//If input is not visible
		if (input.style.display == 'none') {
			
			button.style.color = '#3366BB';	//Set button to on
			input.style.display = 'block';	//Display input
			input.focus();					//Focus input
			
		}
		//Else, button is visible
		else {
			
			button.style.color = '#000000'; //Set button to off
			input.style.display = 'none';	//Hide input
			
		}
			
	}
	
	/*
	 * addMember function for actually adding a member to a new payment from a given PIN
	 */
	function addMember(pin) {
		
		//If PIN complete
		if (pin.value.length == 5) {
			
			//Get quick user details
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			xmlhttp.onreadystatechange = function() {
			
				//Once request is complete
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					
					//If there is a result
					if (xmlhttp.responseText != '') {
						
						var flag	= true;									//Flag for validating user
						var members	= document.getElementById('members');	//Get members list
						
						var member = new User(JSON.parse(xmlhttp.responseText)); //Get response and parse into User object
						
						//If the entered user is the same as the current user
						if (member.id == id) {
						
							alert('You cannot add yourself');	//Alert the user
							pin.value = '';						//Clear the PIN
							flag = false;						//Prevent add
							
						}
						//Else, user is different
						else {
						
							var inputs = members.getElementsByTagName('input');	//Get inputs in members list
							
							//Loop through inputs
							for (var i = 0; i < inputs.length; i++) {
								
								//If user is already in the list
								if (inputs[i].id == 'member_' + member.id) {
									
									alert(member.fullName + ' has already been added');	//Alert user
									pin.value = '';										//Clear the PIN
									flag = false;										//Prevent add
								
								} 
								
							}
							
						}
						
						//If user can be added
						if (flag) {
						
							pin.value = ''; //Clear the PIN
					
							var remaining = ''; //Remaining HTML of members list if needed
							
							//If there are members already in the list
							if (inputs.length > 0) {
								remaining = members.innerHTML; //Get remaining HTML
							}
							
							//Add user details plus hidden input to top of members list
							members.innerHTML = '<div class="clear" onclick="removeMember(this, member_' + member.id + ');">' + member + '</div><input id="member_' + member.id + '" name="members[]" type="hidden" value="' + member.id + '" />' + remaining;
						
						}
						
					}
					//Else, no user found
					else {
						alert('No user found, check the PIN entered is correct'); //Alert user
					}
					
					
				}
				
			}
			
			xmlhttp.open('GET', server + handle + 'newUser=' + pin.value, false);	//Specify AJAX request
			xmlhttp.send();															//And send
			
			
		}
		
	}
	
	/*
	 * removeMember function for removing a member from a new payment
	 */
	function removeMember(user, input) {
		
		//Confirm action
		if (confirm('Remove ' + user.childNodes[0].childNodes[1].childNodes[0].innerHTML + '?')) {

			members = user.parentNode;	//Get members list
			members.removeChild(user);	//Remove user details from list
			members.removeChild(input);	//Remove hidden input
			
			//If there are no members remaining in the list
			if (members.getElementsByTagName('input').length == 0) {
				members.innerHTML = 'Use the plus icon to add people'; //Reset empty text message
			}
			
		}
		
	}
	
	/*
	 * validate function for client-side validation of the new payment creation form
	 */
	function validate(form) {
		
		//Test input values have been entered
		var flag = !(form['name'].value == null || form['name'].value == '');	//Check payment name
		flag = !(form['pounds'].value == null || form['pounds'].value == '');	//Check payment amount
		flag = !(form['members[]'] == null || form['members[]'] == undefined);	//Check payment members has at least one
		
		//If everything is present
		if (flag) {
			
			var formData = new FormData(form); //Create FormData object
			
			//Submit form
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Handle various callbacks from request
			xmlhttp.onreadystatechange = function() {
			
				//Once request is complete
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					window.location.replace('dashboard.html?id=' + id); /* TODO do this better - message then click to redirect */
				}
				
			}
			
			xmlhttp.open('POST', server + handle + 'id=' + id, false);	//Specify AJAX request
			xmlhttp.send(formData);										//And send with form data
			
		}
		//Alert if any are missing
		else {
			alert('Please complete all fields');
		}
		
		return false; //Prevent form default action
		
	}
	
	/*
	 * notifications function for loading notifications page content
	 */
	function notifications() {
		
		//Get notifications list
		xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
		
		//Handle various callbacks from request
		xmlhttp.onreadystatechange = function() {
		
			//Once request is complete
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				//If there is a response
				if (xmlhttp.responseText != '') {
				
					var notifications = JSON.parse(xmlhttp.responseText); //Parse response
					
					var listString = ''; //String for generating list of notifications
					
					//Loop through response array
					for (var i in notifications) {
					
						notifications[i] = new Notification(notifications[i]);	//Create new Notification object from JSON
						listString += notifications[i];							//Add notification to the list
						
					}
					
					document.getElementById('notifications').innerHTML = listString; //Update notifications list
					
				}
				
			}
			
		}
		
		xmlhttp.open('GET', server + handle + 'notifications=' + id, false);	//Specify AJAX request
		xmlhttp.send();															//And send with form data
		
	}
	
	/*
	 * confirmNotification function for handling notification confirmation
	 */
	function confirmNotification(notification, type, payment, contributor) {
		
		//Confirm confirmation of notification
		if (confirm('Are you sure ' + (type == 1 ? 'you are part of this payment' : '') + (type == 2 ? 'this person has paid you' : '') + '?')) {
			
			//Confirm notification
			xmlhttp = new XMLHttpRequest(); //Create new AJAX request object
			
			//Specify AJAX request
			xmlhttp.open(
				'GET',
				server + handle + 'confirm=' + notification + '&type=' + type + '&pid=' + payment + '&cid=' + contributor,
				false
			);
			
			xmlhttp.send(); //And send
			
			window.location.reload(); //Reload page to show updated information
			
		}
		
	}