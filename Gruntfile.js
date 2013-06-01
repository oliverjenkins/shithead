module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    // Configure the copy task to move files from the development to production folders
  
	less: {
	  development: {
	    options: {
	      paths: ["public/css/less"]
	    },
	    files: {
	      "public/css/bootstrap.css": "public/css/less/bootstrap.less",
	      "public/css/style.css": "public/css/less/style.less"
	    }
	  },
	  production: {
	    options: {
	      paths: ["public/css/less"],
	      yuicompress: true
	    },
	    files: {
	    	"public/css/bootstrap.css.min": "public/css/less/bootstrap.less"
	    }
	  }
	},
	jshint: {
	  // define the files to lint
	  files: ['public/js/*.js'],
	  // configure JSHint (documented at http://www.jshint.com/docs/)
	  options: {
	  	ignores: ['public/js/*.tmpl.js'],
	    globals: {
	      jQuery: true,
	      console: true,
	      module: true
	    }

	  }
	},

	ember_handlebars: {
      all: {
        // In practice, this could be:
        // src: ['templates/**/*.hbs', 'templates/**/*.handlebars']
        src: ['views/templates/*.hbs'],
        dest: 'public/js/game.tmpl.js'
      },
      options: {
		  processName: function(filename) {
		  	// this will give the name 'index' rather than the default 'views/templates/index.hbs' name
		  	return filename.substring(filename.lastIndexOf('/')+ 1,filename.length - 4);
		  }
		}
    },

	watch: {
		scripts: {
			files: ['public/js/*.js'],
			tasks: ['jshint'],
			options: {
				nospawn: true,
			},
		},
		less: {
			files: ['public/css/less/*.less'],
			tasks: ['less'],
			options: {
				nospawn: true,
			},
		},
		ember_handlebars: {
			files: ['views/templates/*.hbs'],
			tasks: ['ember_handlebars'],
			options: {
				nospawn: true,
			}

		}
	},


  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-ember-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define your tasks here
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('manual', ['jshint','less','ember_handlebars']);
};