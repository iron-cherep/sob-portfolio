"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var server = require("browser-sync").create();
var run = require("run-sequence");
var rename = require("gulp-rename");
var del = require("del");
var php_server = require('gulp-connect-php');

var postcss = require("gulp-postcss");
var mqpacker = require("css-mqpacker");
var minifyCss = require("gulp-csso");
var autoprefixer = require("autoprefixer");

var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var svgstore = require("gulp-svgstore");


gulp.task("style", function() {
  gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
      "last 1 version",
      "last 2 Chrome versions",
      "last 2 Firefox versions",
      "last 2 Opera versions",
      "last 2 Edge versions"
      ]})
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

//copy html files to build directory - needed to process html change event
gulp.task("html", function() {
  return gulp.src([
    "*.html", "project-pages/*.html"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
})

//copy JS files to build directory - needed to process JS change event
gulp.task("js", function() {
  return gulp.src([
    "js/*.js"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
})

gulp.task("html", function() {
  return gulp.src([
    "*.html", "project-pages/*.html"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
})

gulp.task("php", function() {
  return gulp.src([
    "*.php"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
})

gulp.task("symbols", function() {
  return gulp.src("build/img/icons-for-sprite/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("symbols.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("images", function() {
  return gulp.src("img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("img/"));
});

gulp.task("php_server", function() {
  php_server.server({ base: 'build', port: 8010, keepalive: true});
});

gulp.task("serve",["php_server"], function() {
  server.init({
    proxy: '127.0.0.1:8010',
    port: 8080,
    ghostMode: false,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });


  gulp.watch(["*.html", "project-pages/*.html"], ["html"]); //watches for HTML in root directory
  gulp.watch("*.php", ["php"]); //watches for PHP in root directory
  gulp.watch("js/*.js", ["js"]); //watches for JS in root directory
  gulp.watch("sass/**/*.scss", ["style"]); //watches for SCSS in root directory

  gulp.watch("build/*.html").on("change", server.reload); //watches for html in build directory
  gulp.watch("build/*.php").on("change", server.reload); //watches for PHP in build directory
  gulp.watch("build/js/*.js").on("change", server.reload); //watches for JS in build directory

});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "icons/**",
    "project-pages/**",
    "*.ico",
    "*.php",
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
})

gulp.task("clean", function () {
  return del("build");
});

//deletes icons used to make svg sprite
gulp.task("cleanSvg", function () {
  return del("build/img/icons-for-sprite");
});

gulp.task("build", function (fn) {
  run(
    "clean",
    "copy",
    "style",
    "symbols",
    "cleanSvg",
    fn
  );
});
