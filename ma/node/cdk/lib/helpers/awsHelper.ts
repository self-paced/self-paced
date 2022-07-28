import * as AWS from 'aws-sdk';

export const sdkCloudWatchLogs = new AWS.CloudWatchLogs({
  apiVersion: '2014-03-28',
});
export const sdkECR = new AWS.ECR({ apiVersion: '2015-09-21' });
export const sdkCodeBuild = new AWS.CodeBuild({ apiVersion: '2016-10-06' });
export const sdkBatch = new AWS.Batch({ apiVersion: '2016-10-06' });

export const logGroupExists = async (logGroupName: string) => {
  try {
    await sdkCloudWatchLogs
      .describeLogStreams({ logGroupName, limit: 1 })
      .promise();
    return true;
  } catch (err) {
    if ((err as AWS.AWSError).code === 'ResourceNotFoundException') {
      return false;
    }
    throw err;
  }
};

export const ecrImageExists = async (repoName: string) => {
  try {
    await sdkECR.describeImages({ repositoryName: repoName }).promise();
    return true;
  } catch (err) {
    if ((err as AWS.AWSError).code === 'RepositoryNotFoundException') {
      return false;
    }
    throw err;
  }
};

export const githubSourceCredentialsExists = async () => {
  const res = await sdkCodeBuild.listSourceCredentials().promise();
  const infos = res.sourceCredentialsInfos ?? [];
  for (const info of infos) {
    if (info.serverType === 'GITHUB') return true;
  }
  return false;
};
