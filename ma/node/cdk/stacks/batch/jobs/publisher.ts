import { basename } from 'path';
import BatchJobDef from '../models/BatchJobDef';
import BatchRepo from '../enums/BatchRepo';

const jobDef: BatchJobDef = {
  name: basename(__filename, '.ts'),
  image: BatchRepo.MA_BATCH,
  vcpu: 1,
  memory: 2048,
  retryAttempts: 1,
  timeoutSeconds: 600,
  command: ['greeting', 'Your name', '-s', 'Ref::MESSAGE'],
  parameters: {
    MESSAGE: 'Nice name!!',
  },
};

export default jobDef;
