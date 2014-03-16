var _ = require('underscore'),
	keystone = require('keystone'),
	Types = keystone.Field.Types;


var Test = new keystone.List('Test');

Test.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	video: { type: Types.Url }
	
});

Test.schema.add({
	items: [{ code: String, quantity: Number }]
});
Test.schema.virtual('fullName').get(function() { 
	return this.name.first + ' ' + this.name.last;

});
Test.schema.virtual('videoShareLink').get(function() { 
	// Turns
	// http://www.youtube.com/watch?v=U78i1gLPeaY
	// http://youtu.be/U78i1gLPeaY
	return this.video.replace(/(http:\/\/)?www.youtube.com\/watch\?v=/,'http://youtu.be/');
});

Test.schema.virtual('videoEmbedLink').get(function () {
	// Turns
	// http://www.youtube.com/watch?v=U78i1gLPeaY
	// http://www.youtube.com/embed/U78i1gLPeaY
	return  this.video.replace(/(http:\/\/)?www.youtube.com\/watch\?v=/,'//www.youtube.com/embed/');
});

Test.schema.pre('save', function (next) {
	if (this.video) { 
		var match = this.video.match(/^(http:\/\/|\/\/)?(www.youtube.com\/watch\?v=[^&]+)/);
		if (match) { 
			this.video = '//' + match[2];
		} else { 
			var err = new Error('Not a valid YouTube url');
		}
	}
	next(err);
});


Test.defaultColumns = 'name, email';
Test.register();