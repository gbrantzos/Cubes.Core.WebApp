import { JobParameters } from '@src/app/core/services/scheduler.service';

export interface ParametersEditor {
  getParameters(): JobParameters;
}
