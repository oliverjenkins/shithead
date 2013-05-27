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
	  files: ['lib/*.js','public/js/*.js'],
	  // configure JSHint (documented at http://www.jshint.com/docs/)
	  options: {
	      // more options here if you want to override JSHint defaults
	    globals: {
	      jQuery: true,
	      console: true,
	      module: true
	    }
	  }
	},

  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  
  // Define your tasks here
  grunt.registerTask('default', ['less','jshint']);
};