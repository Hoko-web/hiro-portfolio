# hiro-portfolio

ミニマルデザインのポートフォリオサイト。HTML / Sass / バニラJS を Gulp でビルドしています。

## 技術スタック

| 項目 | 使用技術 |
| --- | --- |
| マークアップ | HTML5（セマンティック + ARIA） |
| スタイル | Sass (SCSS)、FLOCSS + BEM、CSSカスタムプロパティ |
| スクリプト | バニラJavaScript（IntersectionObserver） |
| ビルド | Gulp 5 / Dart Sass / PostCSS + Autoprefixer / Browser-Sync |
| レスポンシブ | モバイルファースト、SP / TB(768px〜) / PC(1024px〜) |
| アクセシビリティ | キーボード操作、`aria-*` 属性、`prefers-reduced-motion` 対応 |

## ディレクトリ構成

```
hiro-portfolio/
├── index.html
├── css/style.css        # Gulp が生成（直接編集しない）
├── sass/                # FLOCSS 構成
│   ├── foundation/      # reset / variables / mixins / base / typography
│   ├── layout/          # .l-header / .l-footer / .l-container / .l-section
│   └── object/
│       ├── component/   # .c-button / .c-section-title / .c-tag / .c-link-stroke
│       ├── project/     # .p-hero / .p-about / .p-skills / .p-works / ...
│       └── utility/     # .u-vh / .u-text-*
├── js/main.js
├── img/works/           # ダミー画像（後で差し替え）
├── gulpfile.js          # ビルド設定
└── package.json
```

## CSS命名規則（FLOCSS + BEM）

| プレフィックス | 役割 |
| --- | --- |
| `l-*` | レイアウト（ページ骨格） |
| `c-*` | コンポーネント（横断UI） |
| `p-*` | プロジェクト（このサイト固有のブロック） |
| `u-*` | ユーティリティ（1プロパティ相当） |
| `js-*` | JS のフック専用（スタイル付与禁止） |
| `is-*` / `has-*` | 状態クラス（`.is-open` など） |

ブロック内構造は BEM（`block__element`、`block--modifier`）。

## セットアップ

```bash
# 1. 依存インストール（初回だけ）
npm install

# 2. 開発サーバー起動（SCSSの変更を監視＋ブラウザ自動リロード）
npm run dev

# 3. 本番ビルド（一度だけコンパイル）
npm run build
```

`npm run dev` を実行するとブラウザが自動で `http://localhost:3000` を開きます。

### Gulp タスク詳細

| コマンド | 処理内容 |
| --- | --- |
| `npm run dev` | SCSSコンパイル → autoprefixer適用 → browser-sync起動 → SCSS/HTML/JSを監視 |
| `npm run build` | 一度だけコンパイル（本番用、ウォッチしない） |

## 差し替え項目

`index.html` 末尾のコメントに差し替え項目の一覧があります。`{{NAME}}`, `{{EMAIL}}` などを一括置換で埋めてください。
