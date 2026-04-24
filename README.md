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
├── src/                   ← 編集対象はこの中だけ
│   ├── index.html
│   ├── sass/              ← FLOCSS 構成
│   │   ├── foundation/    # reset / variables / mixins / base / typography
│   │   ├── layout/        # .l-header / .l-footer / .l-container / .l-section
│   │   └── object/
│   │       ├── component/ # .c-button / .c-section-title / .c-tag / .c-link-stroke
│   │       ├── project/   # .p-hero / .p-about / .p-skills / ...
│   │       └── utility/   # .u-vh / .u-text-*
│   ├── js/main.js
│   └── img/works/         # ダミー画像（後で差し替え）
├── dist/                  ← Gulp が自動生成（触らない・本番公開対象）
│                            .gitignore で除外済み
├── gulpfile.js            # ビルド設定
├── package.json
└── README.md
```

**ルール**:
- **`src/`** 以下だけを編集する
- **`dist/`** は触らない（Gulp が自動生成、git 管理外）
- 本番公開は `dist/` を配信する

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

# 2. 開発サーバー起動（src/ の変更を監視＋dist/ を配信＋ブラウザ自動リロード）
npm run dev

# 3. 本番ビルド（dist/ を一度だけ生成）
npm run build
```

`npm run dev` を実行するとブラウザが自動で `http://localhost:3000` を開きます。

### Gulp タスク詳細

| コマンド | 処理内容 |
| --- | --- |
| `npm run dev` | src/ → dist/ にビルド → browser-sync 起動 → src/ を監視して自動再ビルド |
| `npm run build` | 一度だけ src/ → dist/ に出力（本番用） |

## デプロイ（Cloudflare Pages）

| 項目 | 値 |
| --- | --- |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version（環境変数 NODE_VERSION） | `20` |

## 差し替え項目

`src/index.html` 末尾のコメントに差し替え項目の一覧があります。`{{NAME}}`, `{{EMAIL}}` などを一括置換で埋めてください。
