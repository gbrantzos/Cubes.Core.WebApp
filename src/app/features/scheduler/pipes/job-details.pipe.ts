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
        details += ', will run at ' + format(job.nextExecutionAt, 'dd/MM/yyyy HH:mm');
      } else {
        details += ', will run at ' + format(job.nextExecutionAt, 'HH:mm');
      }
    }

    return details;
  }

}
