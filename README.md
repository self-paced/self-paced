## セットアップ

**前提条件**

- npm がインストールされていること
  - `npm --version`コマンドで確認

**手順**

- リポジトリーのルートからターミナルを開き、以下のコマンドを実行する。

```bash
npm ci
```

- API の環境変数を設定する。

```bash
cp ma/node/sls/.env.example ma/node/sls/.env
```

- アプリを実行する。

```bash
# apiとfront両方実行されます。
npm run dev
```

- フロント： http://localhost:4040
- API： http://localhost:5050/local

※ 開発を始める時は、eslint と prettier の IDE の extension をインストールしてください。

### Design システムのインストール

現在は private の状態なので、インストールする前にアカウントの作成が必要です。  
アカウント作成時は菊池に連絡ください。

```
npm login
npm install @super_studio/ecforce_ui_albers
```
