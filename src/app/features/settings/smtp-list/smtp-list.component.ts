import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { SettingsStore, SmtpProfile } from '@features/settings/services/settings.store';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'cubes-smtp-list',
  templateUrl: './smtp-list.component.html',
  styleUrls: ['./smtp-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmtpListComponent implements OnInit, OnDestroy {
  @Output() newProfile = new EventEmitter<void>();
  @Output() profileSelected = new EventEmitter<SmtpProfile>();
  private subs = new SubSink();
  public smtpProfiles$: Observable<SmtpProfile[]>;
  public selectedProfile = '';

  constructor(private store: SettingsStore, private changeDetectorRef: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.smtpProfiles$ = this.store.smtpProfiles;
    this.subs.sink = this.store.selectedSmtpProfile.subscribe((cnx) => {
      this.selectedProfile = cnx?.name ?? '';
      this.changeDetectorRef.detectChanges();
    });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelect(smtp: SmtpProfile) {
    this.profileSelected.emit(smtp);
  }
  onNew() {
    this.newProfile.emit();
  }
}
