import { JobParameters } from '@core/services/scheduler.service';

export interface ParametersEditor {
  getParameters(): JobParameters;
}
