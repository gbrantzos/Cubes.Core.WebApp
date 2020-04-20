import { PipeTransform, Pipe } from '@angular/core';
import { SchedulerJob } from '@features/scheduler/services/scheduler.models';
import { isTomorrow, format } from 'date-fns';

@Pipe({ name: 'jobDetails' })
export class JobDetails implements PipeTransform {
  transform(job: SchedulerJob) {
    let details = '';

    details = job.cronExpressionDescription;
    if (!job.nextExecutionAt) {
      details += ', not scheduled';
    } else {
      if (isTomorrow(job.nextExecutionAt)) {
        details += ', next run at ' + format(job.nextExecutionAt, 'dd/MM/yyyy HH:mm:ss');
      } else {
        details += ', next run at ' + format(job.nextExecutionAt, 'HH:mm:ss');
      }
    }
    if (details.endsWith(':00')) { details = details.substr(0, details.length - 3); }

    return details;
  }

}
