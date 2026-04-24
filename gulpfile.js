/**
 * gulpfile.js
 * ----------------------------------------------------------------
 * 役割:
 *  1) sass を CSS にコンパイル
 *  2) autoprefixer でベンダープレフィックスを自動付与
 *  3) browser-sync でローカルサーバーを立て、変更時に自動リロード
 *
 * 使い方:
 *   npm run dev   → watch + ブラウザ自動起動（開発中はこれを叩きっぱなし）
 *   npm run build → 本番用に一度だけコンパイル
 * ----------------------------------------------------------------
 */

const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();

// ------------------------------------------------------------
// 監視・出力先のパス
// ------------------------------------------------------------
const paths = {
  scssEntry: "sass/style.scss",
  scssWatch: "sass/**/*.scss",
  cssDest: "css",
  html: "./*.html",
  js: "js/**/*.js",
};

// ------------------------------------------------------------
// SCSS コンパイル
// ・plumber でエラーが出ても watch が止まらないようにする
// ・sourcemaps は Gulp 5 の標準機能で src/dest に渡す
// ・browserSync.stream() で CSS だけピンポイントにリロード
// ------------------------------------------------------------
function styles() {
  return src(paths.scssEntry, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler(err) {
          // エラー内容を見やすく表示し、watch を継続させる
          console.log("\n[Sass Error]", err.message, "\n");
          this.emit("end");
        },
      })
    )
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.cssDest, { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

// ------------------------------------------------------------
// ブラウザ自動リロード
// ------------------------------------------------------------
function reload(done) {
  browserSync.reload();
  done();
}

// ------------------------------------------------------------
// ローカルサーバー起動
// ・baseDir はプロジェクトルート
// ・open: true で起動時に自動でブラウザを開く
// ------------------------------------------------------------
function serve(done) {
  browserSync.init({
    server: { baseDir: "./" },
    notify: false, // 画面右上の "Connected to BrowserSync" 通知を非表示
    open: true,
    port: 3000,
  });
  done();
}

// ------------------------------------------------------------
// 監視タスク
// ------------------------------------------------------------
function watchFiles() {
  watch(paths.scssWatch, styles);
  watch(paths.html, reload);
  watch(paths.js, reload);
}

// ------------------------------------------------------------
// エクスポート
// ------------------------------------------------------------
exports.styles = styles;
exports.build = styles; // 本番ビルドは styles 一発で OK
exports.default = series(styles, serve, watchFiles);
