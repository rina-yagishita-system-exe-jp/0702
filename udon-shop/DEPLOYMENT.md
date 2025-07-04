# GitHub Pagesデプロイ手順

## 前提条件

1. GitHubアカウントを持っていること
2. このプロジェクトをGitHubリポジトリにプッシュしていること

## デプロイ手順

### 1. GitHubリポジトリの設定

1. GitHubでリポジトリページを開く
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. 「Source」セクションで「GitHub Actions」を選択

### 2. 自動デプロイの有効化

- `main`または`master`ブランチにコードをプッシュすると、自動的にGitHub Actionsが実行されます
- `.github/workflows/deploy.yml`ファイルがデプロイプロセスを制御します

### 3. デプロイ状況の確認

1. リポジトリの「Actions」タブでビルド状況を確認
2. ビルドが成功すると、GitHub Pagesでサイトが公開されます
3. 公開URLは`https://[ユーザー名].github.io/[リポジトリ名]/`になります

## 技術的な詳細

### 静的サイト生成の設定

- `next.config.ts`で`output: 'export'`を設定
- `basePath`と`assetPrefix`でGitHub Pagesのサブディレクトリに対応
- `images.unoptimized: true`で画像最適化を無効化

### データの取り扱い

- 本番環境ではモックデータを使用（`src/lib/mock-data.ts`）
- データベース機能は開発環境でのみ利用可能
- 認証機能も開発環境でのみ利用可能

### ファイル構成

```
udon-shop/
├── .github/workflows/deploy.yml  # GitHub Actionsワークフロー
├── public/
│   ├── .nojekyll                 # Jekyll無効化
│   └── images/                   # 画像ファイル（SVG形式）
├── src/
│   ├── lib/
│   │   ├── data-provider.ts      # データ取得の抽象化
│   │   └── mock-data.ts          # モックデータ
│   └── types/
│       └── product.ts            # 型定義
└── next.config.ts                # Next.js設定
```

## トラブルシューティング

### ビルドエラーが発生した場合

1. ローカルで`npm run build`を実行してエラーを確認
2. TypeScriptエラーがないか確認
3. 依存関係が正しくインストールされているか確認

### 画像が表示されない場合

1. 画像ファイルが`public/images/`ディレクトリに配置されているか確認
2. 画像パスが正しく設定されているか確認
3. SVGファイルの形式が正しいか確認

### デプロイが失敗する場合

1. GitHub Actionsのログを確認
2. `package.json`の依存関係を確認
3. Node.jsのバージョンが対応しているか確認（推奨: Node.js 20）

## 更新手順

1. コードを修正
2. `git add .`
3. `git commit -m "更新内容"`
4. `git push origin main`
5. GitHub Actionsが自動実行され、サイトが更新されます