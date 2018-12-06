/**
 * Created by xiaogang on 2018/7/10.
 * 使用less编写页面样式！
 */
"use strict";

"use strict";
const gulp = require('gulp');
const Clean = require('gulp-clean');
const cssBase64 = require('gulp-css-base64');
const Less = require('gulp-less');
const LessAutoprefix = require('less-plugin-autoprefix');
const autoprefix = new LessAutoprefix({browsers: ['last 2 versions']});
const replace = require('gulp-replace');

const ViewsFolder = './src/views';
const CommonFolder = './src/common';

gulp.task('views_css_clean', function () {
  return gulp.src([`${ViewsFolder}/**/**.css`], {read: false})
    .pipe(Clean({force: true}));
});


//less to css

gulp.task('common_less_to_css', ['views_css_clean'], function () {
  console.log("less_to_css");

  gulp.src([`${CommonFolder}/**/**.less`])
    .pipe(Less({
      plugins: [autoprefix]
    }))
    .pipe(replace(/box-orient/g, function (match) {
      //todo : Replaces instances of "-box-orient" with "-webkit-box-orient"
      return `-webkit-${match}`;
    }))
    .pipe(cssBase64({
      baseDir: "./components/",
      maxWeightResource: 32768 * 1024,
      extensionsAllowed: ['.gif', '.jpg', '.png']
    }))
    .pipe(gulp.dest(CommonFolder));
});

gulp.task('views_less_to_css', ['views_css_clean'], function () {
  console.log("less_to_css");

  return gulp.src([`${ViewsFolder}/**/**.less`])
    .pipe(Less({
      plugins: [autoprefix]
    }))
    .pipe(replace(/box-orient/g, function (match) {
      //todo : Replaces instances of "-box-orient" with "-webkit-box-orient"
      return `-webkit-${match}`;
    }))
    .pipe(cssBase64({
      baseDir: "./components/",
      maxWeightResource: 32768 * 1024,
      extensionsAllowed: ['.gif', '.jpg', '.png']
    }))
    .pipe(gulp.dest(ViewsFolder));
});

gulp.task("less-watch", [], function () {
  gulp.watch([`${ViewsFolder}/**/**.less`], ['views_less_to_css'], function (event) {

  });
  gulp.watch([`${CommonFolder}/**/**.less`], ['common_less_to_css'], function (event) {

  });
});

//
gulp.task("default", ['views_css_clean', 'common_less_to_css', 'views_less_to_css'], function () {
  console.log("gulp default finished");
});

