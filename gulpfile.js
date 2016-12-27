"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var server = require("browser-sync").create();
var run = require("run-sequence");

var rename = require("gulp-rename");
var del = require("del");

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
    "*.html"
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
  return gulp.src("build/img/**/*.{png,jpg,gif}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build",
    ghostMode: false,
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });


  gulp.watch("sass/**/*.scss", ["style"]);
  gulp.watch("*.html", ["html"]); //watches for html in root directory and copy them to /build on changes
  gulp.watch("build/*.html").on("change", server.reload); //watches for html in build directory
  gulp.watch("js/*.js", ["js"]); //watches for JS in root directory and copy them to /build on changes
  gulp.watch("build/js/*.js").on("change", server.reload); //watches for JS in build directory

});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
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
    "images",
    "symbols",
    "cleanSvg",
    fn
  );
});
