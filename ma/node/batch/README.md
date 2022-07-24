## About the project

Using `Commander` to create a dockerized TypeScript CLI to be used for running batch jobs on AWS.

## Getting started

From the root of the app, run:

```bash
docker build -t typescript-cli .

# For M1 Mac, use this command:
# docker buildx build --platform=linux/amd64 -t ma-batch .
```

This will build the docker image.  
You can run the job using the following command:

```bash
docker run --rm -it ma-batch greeting YourName -s 'Nice name!'
```

## Push to ECR

```bash
# login
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin 925634978448.dkr.ecr.ap-northeast-1.amazonaws.com/ma-batch

# tag
docker tag ma-batch:latest 925634978448.dkr.ecr.ap-northeast-1.amazonaws.com/ma-batch

# push
docker push 925634978448.dkr.ecr.ap-northeast-1.amazonaws.com/ma-batch:latest
```

## Check the tutorial

https://blog.perfect-base.com/typescript-cli-aws-batch
