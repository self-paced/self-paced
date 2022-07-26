## セットアップ

**前提条件**

- npm がインストールされていること
  - `npm --version`コマンドで確認

**手順**

- ecforce コンポネントライブラリーの設定
  - 個人の npm アカウントで権限を依頼する
  - npm にログインする：`npm login`

※ 任意：ローカルのパッケージで動かしたい場合は「[こちら](https://www.notion.so/bb1fabefea564718ae324ef0987969a0?v=83c6efebb5504d2e8e2b6ac861972f63&p=d56f68aec3644c99b07878c7220188c3&pm=s)」の手順を参照。

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
