import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cubes-smtp-selector',
  templateUrl: './smtp-selector.component.html',
  styleUrls: ['./smtp-selector.component.scss']
})
export class SmtpSelectorComponent implements OnInit {
  @Input() profiles: string[];
  @Output() select = new EventEmitter<string>();
  public current: string;
  constructor() { }
  ngOnInit() {
    if (this.profiles && this.profiles.length > 0) {
      this.onSelect(this.profiles[0]);
    }
  }

  onSelect(profile: string) {
    this.current = profile === 'NEW' ? 'New profile' : profile;
    this.select.emit(profile);
  }
}
