/**
 * gulpfile.js
 * ----------------------------------------------------------------
 * src/ を編集 → dist/ にビルド出力、という役割分担で運用する。
 *
 * 役割:
 *  1) sass → CSS へコンパイル（dist/css/style.css に出力）
 *  2) autoprefixer でベンダープレフィックスを自動付与
 *  3) HTML / JS / 画像は dist/ へそのままコピー
 *  4) browser-sync で dist/ をローカルサーバー配信し、自動リロード
 *
 * 使い方:
 *   npm run dev    → watch + ブラウザ自動起動（開発中はこれを叩きっぱなし）
 *   npm run build  → 本番用に一度だけ dist/ を生成
 * ----------------------------------------------------------------
 */

const { src, dest, watch, series, parallel } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const plumber = require("gulp-plumber");
const browserSync = require("browser-sync").create();

// ------------------------------------------------------------
// 監視元（src）と出力先（dist）のパス定義
// ------------------------------------------------------------
const paths = {
  src: {
    scssEntry: "src/sass/style.scss",
    scssWatch: "src/sass/**/*.scss",
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    img: "src/img/**/*",
  },
  dist: {
    root: "dist",
    css: "dist/css",
    js: "dist/js",
    img: "dist/img",
  },
};

// ------------------------------------------------------------
// SCSS コンパイル
// ・plumber でエラーが出ても watch が止まらないようにする
// ・sourcemaps は Gulp 5 標準機能で src/dest に渡す
// ・browserSync.stream() で CSS だけピンポイントにリロード
// ------------------------------------------------------------
function styles() {
  return src(paths.src.scssEntry, { sourcemaps: true })
    .pipe(
      plumber({
        errorHandler(err) {
          console.log("\n[Sass Error]", err.message, "\n");
          this.emit("end");
        },
      })
    )
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(dest(paths.dist.css, { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

// ------------------------------------------------------------
// HTML を dist/ へコピー
// ・src/index.html → dist/index.html
// ・将来サブページが増えても src/**/*.html で拾える
// ------------------------------------------------------------
function copyHtml() {
  return src(paths.src.html, { base: "src" }).pipe(dest(paths.dist.root));
}

// ------------------------------------------------------------
// JS を dist/js/ へコピー
// ------------------------------------------------------------
function copyJs() {
  return src(paths.src.js, { base: "src/js" }).pipe(dest(paths.dist.js));
}

// ------------------------------------------------------------
// 画像を dist/img/ へコピー
// ・encoding: false でバイナリ（png/jpg等）を壊さない
// ・サブフォルダ構造（works/ など）を保つため base を指定
// ------------------------------------------------------------
function copyImg() {
  return src(paths.src.img, { base: "src/img", encoding: false }).pipe(
    dest(paths.dist.img)
  );
}

// ------------------------------------------------------------
// ブラウザリロード
// ------------------------------------------------------------
function reload(done) {
  browserSync.reload();
  done();
}

// ------------------------------------------------------------
// ローカルサーバー起動
// ・baseDir は dist/（本番と同じ構成で配信）
// ------------------------------------------------------------
function serve(done) {
  browserSync.init({
    server: { baseDir: paths.dist.root },
    notify: false,
    open: true,
    port: 3000,
  });
  done();
}

// ------------------------------------------------------------
// 監視タスク
// ・SCSS 変更 → 再コンパイル
// ・HTML 変更 → コピー後リロード
// ・JS 変更  → コピー後リロード
// ・画像変更 → コピー後リロード
// ------------------------------------------------------------
function watchFiles() {
  watch(paths.src.scssWatch, styles);
  watch(paths.src.html, series(copyHtml, reload));
  watch(paths.src.js, series(copyJs, reload));
  watch(paths.src.img, series(copyImg, reload));
}

// ------------------------------------------------------------
// 公開タスク
// ・build：一度だけ全ファイルを dist へ出力
// ・default（npm run dev）：build → serve → watch の順で起動
// ------------------------------------------------------------
const build = parallel(styles, copyHtml, copyJs, copyImg);

exports.styles = styles;
exports.build = build;
exports.default = series(build, serve, watchFiles);
