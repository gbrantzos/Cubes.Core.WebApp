import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cubes-smtp-selector',
  templateUrl: './smtp-selector.component.html',
  styleUrls: ['./smtp-selector.component.scss']
})
export class SmtpSelectorComponent implements OnInit {
  private _profiles: string[];
  @Input()
  set profiles(value: string[]) {
    this._profiles = value || [];
    if (this._profiles && this._profiles.length > 0) {
      this.onSelect(this._profiles[0]);
    }
  }
  get profiles() { return this._profiles || []; }
  @Output() select = new EventEmitter<string>();
  public current: string;

  constructor() { }
  ngOnInit() { }

  onSelect(profile: string) {
    this.current = profile === 'NEW' ? 'New profile' : profile;
    this.select.emit(profile);
  }
}
