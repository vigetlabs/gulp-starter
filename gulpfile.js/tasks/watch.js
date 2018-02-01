var gulp        = require('gulp')
var watch       = require('gulp-watch')
var path        = require('path')
var projectPath = require('../lib/projectPath')

var watchTask = function() {
  var watchableTasks = ['fonts', 'iconFont', 'images', 'svgSprite', 'html', 'stylesheets', 'static']

  function getTaskPathFor(taskName) {
    switch (taskName) {
      case 'iconFont':
        return PATH_CONFIG.icons
      case 'svgSprite':
        return PATH_CONFIG.icons
      case 'html':
        return PATH_CONFIG.html
      case 'static':
        return PATH_CONFIG.static
      default:
        return PATH_CONFIG[taskName]
    }
  }

  watchableTasks.forEach(function(taskName) {
    var taskConfig = TASK_CONFIG[taskName]
    var taskPath = getTaskPathFor(taskName)
    var watchConfig = {}
    if (TASK_CONFIG.watch !== undefined && TASK_CONFIG.watch.gulpWatch !== undefined) {
      watchConfig = TASK_CONFIG.watch.gulpWatch
    }

    if(taskConfig) {
      var srcPath = projectPath(PATH_CONFIG.src, taskPath.src)
      var globPattern = '**/*' + (taskConfig.extensions ? '.{' + taskConfig.extensions.join(',') + '}' : '')
      var watchPath = [];
      watchPath.push(path.join(srcPath, globPattern));

      if (taskConfig.sass !== undefined && taskConfig.sass.includePaths !== undefined) {
          taskConfig.sass.includePaths.forEach(function (includePath) {
              watchPath.push(path.join(includePath, globPattern));
          });
      }

      watch(watchPath, watchConfig, function () {
          require('./' + taskName)()
      })
    }
  })
}

gulp.task('watch', ['browserSync'], watchTask)

module.exports = watchTask
