# my_portfolio

ミニマルデザインのポートフォリオサイト（HTML / Sass / バニラJS）。

## 開発

```bash
# 依存インストール（sass）
npm install

# Sass ウォッチ
npm run sass:watch

# 本番ビルド（圧縮）
npm run sass:build

# ローカルサーバー起動（別ターミナル）
npm run serve
```

## ディレクトリ構成

```
my_portfolio/
├── index.html
├── css/style.css     # sass の出力（直接編集しない）
├── sass/             # FLOCSS 構成
│   ├── foundation/   # 変数・mixin・reset・base
│   ├── layout/       # .l-header / .l-footer / .l-container / .l-section
│   └── object/
│       ├── component/ # .c-button / .c-section-title / .c-tag / .c-link-stroke
│       ├── project/   # .p-hero / .p-about / .p-skills / ...
│       └── utility/   # .u-vh / .u-text-*
├── js/main.js        # バニラJS（defer 読み込み）
└── img/              # 画像（works はダミーSVG）
```

## 命名規則

- `l-*` レイアウト
- `c-*` コンポーネント（横断UI）
- `p-*` プロジェクト（このサイト固有）
- `u-*` ユーティリティ
- `js-*` JSフック専用（スタイル付与禁止）
- `is-*` / `has-*` 状態クラス
- 内部構造は BEM（`block__element`, `block--modifier`）

## 差し替え項目

index.html 末尾のコメントに一覧あり。`{{NAME}}`, `{{EMAIL}}` などをテキストエディタの一括置換で埋める。
