import { JobParameters } from '@features/scheduler/services/scheduler.models';

export interface ParametersEditor {
  getParameters(): JobParameters;
}
