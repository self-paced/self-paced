import { basename } from 'path';
import BatchJobDef from '../models/BatchJobDef';
import BatchRepo from '../enums/BatchRepo';

const jobDef: BatchJobDef = {
  name: basename(__filename, '.ts'),
  image: BatchRepo.PUBLISHER_BATCH,
  vcpu: 1,
  memory: 2048,
  retryAttempts: 1,
  timeoutSeconds: 600,
  command: ['job', 'dump', '-s', 'Ref::SECRET_NAME', '-o', 'Ref::OUTPUT'],
  environment: {
    MODE: 's3',
  },
  parameters: {
    SECRET_NAME: 'override_me',
    OUTPUT: 'override_me',
  },
};

export default jobDef;