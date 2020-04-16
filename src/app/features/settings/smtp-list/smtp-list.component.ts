import { Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SmtpProfile, SettingsStore } from '@features/settings/services/settings.store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cubes-smtp-list',
  templateUrl: './smtp-list.component.html',
  styleUrls: ['./smtp-list.component.scss']
})
export class SmtpListComponent implements OnInit, OnDestroy {
  @Output() newProfile = new EventEmitter<void>();
  @Output() profileSelected = new EventEmitter<SmtpProfile>();
  public smtpProfiles$: Observable<SmtpProfile[]>;
  private selectedProfile$: Observable<SmtpProfile>;
  private selectedProfileSub: Subscription;
  public selectedProfile = '';

  constructor(
    private store: SettingsStore,
    private changeDetectorRef: ChangeDetectorRef
  ) { }
  ngOnInit(): void {
    this.smtpProfiles$ = this.store.smtpProfiles;
    this.selectedProfileSub = this.store
      .selectedSmtpProfile
      .subscribe(cnx => {
        this.selectedProfile = (cnx?.name) ?? '';
        this.changeDetectorRef.detectChanges();
      });
  }
  ngOnDestroy(): void {
    if (this.selectedProfileSub) {
      this.selectedProfileSub.unsubscribe();
    }
  }

  onSelect(smtp: SmtpProfile) { this.profileSelected.emit(smtp); }
  onNew() { this.newProfile.emit(); }
}
