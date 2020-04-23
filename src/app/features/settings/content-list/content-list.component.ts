import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StaticContent } from '@features/settings/services/content.model';
import { ContentStore } from '@features/settings/services/content.store';
import { Observable } from 'rxjs';
import { ConfigurationService } from '@core/services/configuration.service';

@Component({
  selector: 'cubes-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentListComponent implements OnInit {
  @Output() newContent = new EventEmitter<void>();
  @Output() contentSelected = new EventEmitter<StaticContent>();

  public content$: Observable<StaticContent[]>;
  public selectedContent: string;

  constructor(private store: ContentStore, private config: ConfigurationService) {}

  ngOnInit(): void {
    this.content$ = this.store.content;
    this.store.selectedContent.subscribe((cnt) => {
      this.selectedContent = cnt?.requestPath;
    });
  }

  onSelect(cnt: StaticContent) {
    this.contentSelected.emit(cnt);
  }

  onNew() {
    this.newContent.emit();
  }

  openLink(path: string) {
    window.open(`${this.config.baseUrl}/${path}`, '_blank');
  }
}
