#!/usr/bin/env node
import 'source-map-support/register';
import { App as CdkApp } from 'aws-cdk-lib';
import configs, { EnvName, constants } from '../lib/config';
import { Vpc } from '../stacks/vpc';

const app = new CdkApp();

function buildEnvStacks(env: EnvName) {
  new Vpc(app, `${constants.projectName}-${env}-Vpc`, configs[env]);
}

buildEnvStacks(process.env.CDK_ENV as EnvName);
