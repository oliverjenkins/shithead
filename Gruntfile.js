module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    // Configure the copy task to move files from the development to production folders
  
	less: {
	  development: {
	    options: {
	      paths: ["public/styles/"]
	    },
	    files: {
	      "public/styles/site.css": "public/styles/site.less",
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
	},


  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Define your tasks here
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('manual', ['jshint','less']);
};