const { series, parallel, src, dest, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat"),
  prefix = require("gulp-autoprefixer"),
  pug = require("gulp-pug"),
  sourcemaps = require("gulp-sourcemaps"),
  uglify = require("gulp-uglify"),
  notify = require("gulp-notify"),
  zip = require("gulp-zip"),
  connect = require("gulp-connect");

// convert pug Files to html files
function pugTask() {
  return (
    src(["develop/**/*.pug", "!develop/pug/includes/*.pug"])
      .pipe(pug({ pretty: true }))
      // .pipe(pug())
      .pipe(dest("dist"))
      .pipe(connect.reload())
  );
}

// convert SCSS Files to css files
function sassTask() {
  return (
    src("develop/css/**/*.scss")
      .pipe(sourcemaps.init())
      .pipe(sass.sync().on("error", sass.logError))
      // .pipe(sass.sync({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(prefix("last 2 versions"))
      .pipe(concat("main.css"))
      .pipe(sourcemaps.write("."))
      .pipe(dest("dist/css"))
      .pipe(connect.reload())
  );
}

// concat js Files in one file and compress it
function jsTask() {
  return (
    src(["develop/js/**/*.js", "!develop/js/libraries/*.*"])
      .pipe(concat("main.js"))
      // .pipe(uglify())
      .pipe(dest("dist/js"))
      .pipe(connect.reload())
  );
}

// add css libraries to dist folder
function cssLibrariesTask() {
  return src([
    "develop/css/libraries/*.*",
    "!develop/css/libraries/all.min.css",
  ]).pipe(dest("dist/css/libraries"));
}

// add js libraries to dist folder
function jsLibrariesTask() {
  return src([
    "develop/js/libraries/*.*",
    "!develop/js/libraries/all.min.js",
  ]).pipe(dest("dist/js/libraries"));
}

// add Font Awesome Library Files to dist folder
function fontAwesomeTask() {
  return [
    src("develop/webfonts/*.*").pipe(dest("dist/webfonts")),
    src("develop/css/libraries/all.min.css").pipe(dest("dist/css")),
    src("develop/js/libraries/all.min.js").pipe(dest("dist/js")),
  ];
}

// add images to dist folder
function imagesTask() {
  return src("develop/images/*.*").pipe(dest("dist/images"));
}

// compress all files in dist folder
function compressTask() {
  return src("dist/**/*.*").pipe(zip("website.zip")).pipe(dest("."));
  // .pipe(notify("Files have been compressed"));
}

// watch
function watchTask() {
  pugTask();
  sassTask();
  jsTask();
  cssLibrariesTask();
  jsLibrariesTask();
  fontAwesomeTask();
  imagesTask();
  compressTask();

  connect.server({
    root: "./dist",
    port: 7000,
    livereload: true,
  });
  connect.reload();

  watch("develop/**/*.pug", pugTask);
  watch("develop/css/**/*.scss", sassTask);
  watch("develop/js/**/*.js", jsTask);

  watch("develop/css/libraries/*.*", cssLibrariesTask);
  watch("develop/js/libraries/*.*", jsLibrariesTask);
  watch("develop/images/*.*", imagesTask);
  // watch("dist/**/*.*", compressTask);
}

exports.default = watchTask;
exports.sassTask = sassTask;
exports.pugTask = pugTask;
exports.jsTask = jsTask;
exports.cssLibrariesTask = cssLibrariesTask;
exports.jsLibrariesTask = jsLibrariesTask;
exports.fontAwesomeTask = fontAwesomeTask;
exports.imagesTask = imagesTask;
exports.compressTask = compressTask;
