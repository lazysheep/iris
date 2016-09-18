
module.exports = function(grunt) {
var baseFolder = grunt.option('project') || 'demo';//'environment';
var htmlname = grunt.option('project')||'demo';//'environment'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['out'],
    uglify: {
      options: {
        mangle: {
          except: ['require']
        },
        compress: {
          drop_console: false
        }
        //banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      jsmin: {
        expand: true,
        src: ['ui/*.js', 'xdj/*.js','module/*.js',baseFolder+'/**/*.js','util/*.js', 'modules/*.js', 'dataParse/*.js','action/*.js','modules/**/*.js'],
        dest: 'out/'+baseFolder
      }
    },
    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      all: {
        expand: true,
        src: ['ui/tmpl/*.html', htmlname+'.html'],
        dest: 'out/'+baseFolder
      }
      
    },
    cssmin: {
      all: {
        expand: true,
        src: ['ui/style/*.css'],
        dest: 'out/'+baseFolder
      }
    },
    copy: {
      preprocess: {
        expand: true,
        src: ['lib/**','images/**', 'style/**',baseFolder+'/**/*.json'],
        dest: 'out/'+baseFolder
      },
      dist: {
        expand: true,
        cwd: 'out/'+baseFolder+'/',
        src: ['images/*.png', 'images/*.jpg', 'lib/require.js','style/**','lib/swiper.min.css'],
        dest: 'out/'+baseFolder+'/dist/'
      },
      build: {
        expand: true,
        cwd: 'out/'+baseFolder+'/modules',
        src: ['appBuildConfig.js', 'app.js'],
        dest: 'out/'+baseFolder+'/dist'
      },
      noNative: {
        expand: true,
        cwd: 'out/'+baseFolder+'/',
        src: ['images/*.png', 'images/*.jpg', 'lib/require.js','style/**','lib/swiper.min.css'],
        dest: 'out/'+baseFolder+'/dist'
      },
      data: {
        expand: true,
        src: ['data/**'],
        dest: 'out/'+baseFolder+'/dist'
      }

    },
    requirejs: {
    		options: {
    			baseUrl: "out/"+baseFolder+'/'+baseFolder,
    			mainConfigFile: 'out/'+baseFolder+'/'+baseFolder+'/requireConfig.js'
          // onModuleBundleComplete: function(bundle) {
          //   console.log(bundle);
          // }
    		},
        setConfig: {
          options: {
            out: 'out/'+baseFolder+'/dist/setConfig.js',
            include: ['modules/setConfig']
          }
        },
        start: {
          options: {
            out: 'out/'+baseFolder+'/dist/start.js',
            include: ['../modules/start'].concat(includeModule())
          }
        },
    		
    },
    htmlbuildDist: {
      main: {
        files: {
          'out/dist/app.html':'out/'+baseFolder+'/'+htmlname+'.html'
        }
      }      
    },

    imgs: {

    },
    'http-server': {
 
        'dev': {
            root: '',
            port: 8282,
 
            host: "localhost",
            ext: "html",
  
            logFn: function(req, res, error) { },
 
            openBrowser : true,
            customPages: {
                "/readme": "README.md",
                "/readme.html": "README.html",
                "/": "demo.html"
            }
 
        }
 
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.loadNpmTasks('grunt-contrib-copy');

  //grunt.loadNpmTasks('grunt-newer');

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.loadNpmTasks('grunt-appcache');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-http-server');

  grunt.registerTask('server', ['http-server']);

  function destPack(dest) {
    return dest.replace(/^out\//,'out/'+baseFolder+'/');
  }

  grunt.registerTask('htmlbuildDist', function () {
    var files = grunt.config(this.name).main.files;
    for(var dest in files) {
      processHtml2(files[dest], destPack(dest));
    }
  });

  function processHtml2 (src, dest) {
    var cheerio = require('cheerio');
    var $ = cheerio.load(grunt.file.read(src));
    $('[data-build-act="rm"]').remove();
    //$('[src="modules/app.js"]').attr('src', 'app.js');
    $('[src="modules/app.js"]').after('<script src="appBuildConfig.js"></script><script src="app.js"></script>');
    $('[src="modules/app.js"]').remove();
    grunt.file.write(dest, $.html());
  }



  function includeModule() {
    var mainjson_src = baseFolder+'/config/main.json';
    var maskjson_src = baseFolder+'/config/mask.json';
    var mainjson = grunt.file.readJSON(mainjson_src);
    var isMask = grunt.file.exists(maskjson_src);
    var maskjson = isMask && grunt.file.readJSON(maskjson_src);
    var includes = [];

    var fn = function(json) {
      for (var i in json) {
        if (i === 'require_config') {
          var src = json[i].replace('json!', baseFolder+'/');
          includes.push(json[i]);
          fn(grunt.file.readJSON(src));
        }
         else if (i === 'type') {
          if (includes.indexOf(json[i])>-1) {
            continue;
          } else {
            includes.push(json[i]);
          }
        } else if (i === 'children') {
          for (var j=json[i].length-1;j>=0;j--) {
            fn(json[i][j]);
          }
        }
      }      
    }
    fn(mainjson);
    maskjson && fn(maskjson);
    return includes;
  }

  grunt.registerTask('json', function() {
    includeModule();
  });



  grunt.registerTask('clean', ['clean']);
  grunt.registerTask('default', ['uglify','htmlmin', 'cssmin', 'copy:preprocess', 'copy:build','copy:data','htmlbuildDist','copy:dist','requirejs:setConfig','requirejs:start']);

};
