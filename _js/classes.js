/*
* Author: Callan Heard (c.j.heard@ncl.ac.uk)
* Project: NCL CSC3122: Mobile Computer Systems Development, Portfolio Part 2
* Purpose: settle app class definitions
*/

	var server		= 'http://localhost/csc3122/';	//Back-end server location
	var handle		= 'handle.php?';				//Handler file name
	var profiles	= 'profiles/';					//Profile images directory name

	/*
	 * User class definition
	 */
	function User(json) {
		
		for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
		
		this.fullName	= this.firstName + ' ' + this.lastName; //Initialise full name
		this.profile	= server + profiles + this.id + '.jpg'; //Initialise link to profile image /* TODO would probably be better as db field */
		
		//If amount is defined (ie this is a contributor user)
		if (typeof this.amount == 'string') {
			this.amount = parseFloat(this.amount); //Convert amount to float
		}
		
	}
	
	/*
	 * User class prototype
	 */
	User.prototype = {
		
		/* TODO pin and score */
		 
		/*
		 * User displayProfile method for displaying user details
		 */
		displayProfile: function() {
			
			var returnString = ''; //String for storing mark-up to be returned
			
			//Generate mark-up
			returnString += '<div class="profile">\
<div class="pin">' + this.pin + '</div>\
<img src="' + this.profile + '" alt="' + this.fullName + '\'s Profile Image" />\
<p>' + this.fullName + '</p>\
<p>' + this.email + '</p>\
<p>Your Score: <span class="score ' + (this.percentage < 70 ? 'red' : 'green') + '">' + this.percentage + '</span></p></div>';
			
			return returnString; //Return generated mark-up
			
		},
		
		/*
		 * Override class toString method to generate mark-up for quick display (less info than profile)
		 */
		toString: function() {
			
			var returnString = ''; //String for storing mark-up to be returned
			
			//Generate mark-up
			returnString += '<div class="user clear">\
<img src="' + this.profile + '" alt="' + this.fullName + '\'s Profile Image" />\
<div class="details">\
<p>' + this.fullName + (this.id == id ? ' (You)' : '') + '</p>\
<p>' + this.email + '</p></div>';

			//If amount is defined (ie this is a payment contributor user)
			if (typeof this.amount !== 'undefined') {
				returnString += '<p class="amount ' + (this.settled == 1 ? 'green' : 'red') + '">' + parseFloat(Math.round(Math.abs(this.amount) * 100) / 100).toFixed(2); + '</p>';
			}
			
			//If percentage score is defined (ie user being added to a payment)
			if (typeof this.percentage !== 'undefined') {
				returnString += '<div class="score ' + (this.percentage < 70 ? 'red' : 'green') + '">' + this.percentage + '</div>';
			}
			
			returnString += '</div>';

			return returnString; //Return generated mark-up
			
		}
		
	}
	
	/*
	 * Payment class
	 */
	function Payment(json) {
		
		for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
		
		if (this.amount == 'undefined') this.amount = 0; //Incoming payments will have no contribution amount
		
		this.total = parseFloat(this.total);	//Convert payment total to float
		this.amount = parseFloat(this.amount);	//Convert payment amount to float
		
		this.hostName	= this.firstName + ' ' + this.lastName;			//Initialise full name
		this.profile	= server + profiles + this.hostUser + '.jpg';	//Initialise link to profile image
		this.orientation = this.hostUser == user.id ? 'owed' : 'owes';	//Initialise orientation (incoming/outgoing)
		
	}
	
	/*
	 * Payment class prototype
	 */
	Payment.prototype = {
		
		/* Would probably be better as two separate derived classes for incoming/outgoing */
		
		/*
		 * Override class toString method to generate mark-up
		 */
		toString: function() {
			
			var o				= this.orientation == 'owes';	//Avoid repeating this statement in shorthand
			var returnString	= '';							//String for storing mark-up to be returned
			
			//Generate mark-up
			returnString += '<!-- Payment ' + this.id + ' -->\
<li class="payment clear">\
<a href="payment.html?id=' + id + '&payment=' + this.id + '" class="clear">\
<img src="' + this.profile + '" alt="' + this.hostName + '\'s Profile Image" /> <!-- Payment host profile image -->\
<div class="details">\
<p>' + this.name + '</p>\
<p>' + (o ? this.hostName : 'from ' + this.contributors + ' ' + (this.contributors == 1 ? 'person' : 'people')) + '</p>\
</div>\
<p class="amount ' + (o ? 'red' : 'green') + '">' + parseFloat(Math.round(((o ? this.amount : this.total)) * 100) / 100).toFixed(2) + '</p>\
</a>\
<hr />\
</li>';
			
			return returnString; //Return generated mark-up
			
		}
		
	}
	
	/*
	 * Notification class definition
	 */
	function Notification(json) {
		
		for (var property in json) this[sanitise(property)] = json[property]; //Initialise object from JSON
		
		this.senderName = this.senderFirstName + ' ' + this.senderLastName; //Initialise sender's full name
		
		//Switch on type of notification to determine message to use
		switch (this.type) {
			
			//Type 1: User added to a payment
			case '1':
				this.message = 'added you to the payment';
				break;
			
			//Type 2: Payment member notification of payment
			case '2':
				this.message = 'says they have paid you for';
				break;
			
		}
		
	}
	
	/*
	 * Notification class prototype
	 */
	Notification.prototype = {
		
		/*
		 * Override class toString method to generate mark-up
		 */
		toString: function() {
			
			var returnString	= ''; //String for storing mark-up to be returned
			
			//Generate mark-up
			returnString += '<!-- Notification -->\
<li class="notification clear" onclick="confirmNotification(\'' + this.id + '\', ' + this.type + ', ' + this.paymentId + ', ' + this.senderId + ');">\
<img src="' + server + profiles + this.senderId + '.jpg" alt="' + this.senderName + '\'s Profile Image" />\
<p><span>' + this.senderName + '</span> ' + this.message + ' "<span>' + this.payment + '</span>"</p>\
</li><hr />';
			
			return returnString; //Return generated mark-up
			
		}
		
	}
	
	/*
	 * Sanitise function for sanitising field from database into JavaScript convention (convert '_' spaced into camelCase)
	 */
	function sanitise(string) {
		
		parts = string.split('_'); //Get each part of field name
		
		//Capitalise first letter of each part (other than first)
		for (var i=1; i<parts.length; i++){
			parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substr(1);
		}  
		
		return parts.join(''); //Recombine into string and return
		
	}