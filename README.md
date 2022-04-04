
```
docker-compose build
docker-compose up
````

## 各環境
front http://localhost:3005

### GraphQL playground!!
app graphQLサーバー  
backend http://localhost:3600  
  
ecforce DB gprahQLサーバー  
backend http://localhost:3605  

## 各ディレクトリ
./  
./app/  
./ecforce_db_app/  
./front/  
./docker/ 

### ルートディレクトリ
docker-compose.ymlの設定

### ./front フロントのNext.js
アプリケーションのフロント部分です。

### ./app GraphQLサーバー
フロントとメインで通信を行うAPIサーバーです。  
アプリケーションの挙動は主にここで制御します。

### ./ecforce_db_app ecforce DBのAPIサーバー
ecforceのDB情報を返すAPIサーバーです。


## 環境設定
### フロント


### GraphQLサーバー
設定ファイルのコピー
```
cp -r ./app/.env.sample ./app/.env
```

### ecforce DB API
設定ファイルのコピー
```
cp -r ./ecforce_db_app/.env.sample ./ecforce_db_app/.env
```

## migration
```
cd app
export GODB_POSTGRES='postgres://go_user:password@127.0.0.1:15432/go_db?sslmode=disable'
migrate -path db/migrations/. -database ${GODB_POSTGRES} up
```
