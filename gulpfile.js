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

// concat JS Files in one file and compress it
function jsTask() {
  return (
    src(["develop/JS/**/*.js", "!develop/JS/libraries/*.*"])
      .pipe(concat("main.js"))
      // .pipe(uglify())
      .pipe(dest("dist/js"))
      .pipe(connect.reload())
  );
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
  compressTask();

  connect.server({
    root: "./dist",
    port: 7000,
    livereload: true,
  });
  connect.reload();

  watch("develop/**/*.pug", pugTask);
  watch("develop/css/**/*.scss", sassTask);
  watch("develop/JS/**/*.js", jsTask);
  // watch("dist/**/*.*", compressTask);
}

exports.default = watchTask;
exports.sassTask = sassTask;
exports.pugTask = pugTask;
exports.jsTask = jsTask;
exports.compressTask = compressTask;
