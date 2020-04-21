import { Component, OnInit, ViewChild } from '@angular/core';
import { JobEditorComponent } from '@features/scheduler/job-editor/job-editor.component';
import { SchedulerJob, SchedulerStatus } from '@features/scheduler/services/scheduler.models';
import { SchedulerStore } from '@features/scheduler/services/scheduler.store';
import { DialogService } from '@shared/services/dialog.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'cubes-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss'],
})
export class SchedulerComponent implements OnInit {
  @ViewChild('editor') editor: JobEditorComponent;

  public status$: Observable<SchedulerStatus>;
  constructor(private store: SchedulerStore, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.store.loadData();
    this.status$ = this.store.schedulerStatus;
  }

  toggleScheduler(currentState: string) {
    let command = '';
    if (currentState === 'Active') {
      command = 'stop';
    }
    if (currentState === 'StandBy') {
      command = 'start';
    }

    this.store.sendCommand(command).subscribe((data) => this.dialogService.snackInfo(data));
  }

  async reload() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected job.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.loadData();
  }

  async jobSelected(job: SchedulerJob) {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on selected job.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.selectJob(job.name);
  }

  async newJob() {
    if (this.editor.pendingChanges()) {
      const dialogResult = await this.dialogService
        .confirm('There are unsaved changes on new job.\nDiscard and continue?')
        .toPromise();
      if (!dialogResult) {
        return;
      }
    }
    this.store.addNewJob();
  }
}
