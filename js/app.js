// Backbone Model
var Contact = Backbone.Model.extend({
	defaults: {
		name: '',
		phone: '',
		email: '',
		address: ''
	},
});

// Backbone Collection
var Contacts = Backbone.Collection.extend({
	comparator: function (contact) {
		return contact.get('name');
	}
});

// Instantiate the contacts collection
var contacts = new Contacts();

// Backbone View for one contact
var ContactView = Backbone.View.extend({
	model: new Contact(),
	tagName: 'tr',
	initialize: function () {
		this.template = _.template($('.contact-list-template').html());
	},
	events: {
		'click .edit-contact': 'edit',
		'click .delete-contact': 'delete',
		'click .update-contact': 'update',
		'click .cancel': 'cancel'
	},
	edit: function () {
		this.$('.edit-contact').hide();
		this.$('.delete-contact').hide();
		this.$('.update-contact').show();
		this.$('.cancel').show();

		let name = this.$('.name').html().trim();
		let phone = this.$('.phone').html().trim();
		let email = this.$('.email').html().trim();
		let address = this.$('.address').html().trim();

		this.$('.name').html('<input type="text" class="form-control name-update" value="' + name + '">');
		this.$('.phone').html('<input type="text" class="form-control phone-update" value="' + phone + '">');
		this.$('.email').html('<input type="text" class="form-control email-update" value="' + email + '">');
		this.$('.address').html('<input type="text" class="form-control address-update" value="' + address + '">');
	},
	update: function () {
		this.model.set('name', $('.name-update').val());
		this.model.set('phone', $('.phone-update').val());
		this.model.set('email', $('.email-update').val());
		this.model.set('address', $('.address-update').val());
	},
	cancel: function () {
		contactsView.render();
	},
	delete: function () {
		this.model.destroy();
	},
	render: function () {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// Backbone View for all contacts
var ContactsView = Backbone.View.extend({
	model: contacts,
	el: $('.contact-list'),
	initialize: function () {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function () {
			setTimeout(function () {
				self.render();
			}, 30);
			contacts.sort();
		}, this);
		this.model.on('remove', this.render, this);
	},
	render: function () {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function (contact) {
			self.$el.append((new ContactView({
				model: contact
			})).render().$el);
		});
		return this;
	}
});

// Initialize view for all contacts
var contactsView = new ContactsView();

// Code to handle when contacts are added using the input fields
$(document).ready(function() {
	$('.add-contact').on('click', function() {
		if (!$('.phone-input').val().match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)) {
			alert('Phone number not valid');
		} else if (!$('.email-input').val().match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
			alert('Email not valid');
		} else if (!$('.address-input').val().match(/[A-Za-z0-9'\.\-\s\,]/)) {
			alert('Address not valid');
		} else {
			var contact = new Contact({
				name: $('.name-input').val(),
				phone: $('.phone-input').val(),
				email: $('.email-input').val(),
				address: $('.address-input').val()
			});
			$('.name-input').val('');
			$('.phone-input').val('');
			$('.email-input').val('');
			$('.address-input').val('');
			contacts.add(contact);
		}
	});
});