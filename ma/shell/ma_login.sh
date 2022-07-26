if [ -f ~/.zshenv ]; then
  source ~/.zshenv # 大橋の環境都合です。各自必要であれば.bashrcなど読み込むようにする。
fi

# エラーが起きたら、スクリプトをやめるための設定
set -e

# スクリプト設定
JSON_BASEPATH="${HOME}/.aws/sso/cache"
AWS_CREDENTIALS_PATH="${HOME}/.aws/credentials"
ACC_ID="925634978448"
ROLE_NAME="AdministratorAccess"

# SSOログインをします
aws sso login --profile ma-sso

# 最新のssoログインのjsonデータを取得します
json_file=$(ls -tr "${JSON_BASEPATH}" | tail -n1)
json_data=$(cat ${JSON_BASEPATH}/${json_file})
access_token=$(echo ${json_data} | jq -r '.accessToken')
region=$(echo ${json_data} | jq -r '.region')

# ssoのjwtからAWSのクレデンシャルを取得する
credentials=$(aws sso get-role-credentials \
  --account-id ${ACC_ID} \
  --role-name ${ROLE_NAME} \
  --access-token ${access_token} \
  --region ${region})

# jqでjson文字列からクレデンシャル情報を取得
aws_access_key_id=$(echo ${credentials} | jq -r '.roleCredentials.accessKeyId')
aws_secret_access_key=$(echo ${credentials} | jq -r '.roleCredentials.secretAccessKey')
aws_session_token=$(echo ${credentials} | jq -r '.roleCredentials.sessionToken')

# こちらのスクリプトで作成された古いプロフィールを削除します
overwrite_text="# OVERWRITE FROM HERE"
sed -i "" "/${overwrite_text}/,\$d" ${AWS_CREDENTIALS_PATH}

# 新しいプロフィールを設定する
echo "${overwrite_text}
[ma-sso]
aws_access_key_id = ${aws_access_key_id}
aws_secret_access_key = ${aws_secret_access_key}
aws_session_token = ${aws_session_token}" >> ${AWS_CREDENTIALS_PATH}