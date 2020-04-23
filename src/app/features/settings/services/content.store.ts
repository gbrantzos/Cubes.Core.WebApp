import { Injectable } from '@angular/core';
import { ContentApiClient } from '@features/settings/services/content.api-client';
import { StaticContent } from '@features/settings/services/content.model';
import { DialogService } from '@shared/services/dialog.service';
import { LoadingWrapperService } from '@shared/services/loading-wrapper.service';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ContentStore {
  private readonly content$ = new BehaviorSubject<StaticContent[]>([]);
  public content = this.content$.asObservable();
  public get snapshot() {
    return this.content$.value;
  }

  private readonly selectedContent$ = new BehaviorSubject<StaticContent>(undefined);
  public selectedContent = this.selectedContent$.asObservable();
  public get currentContent() {
    return this.selectedContent$.value;
  }

  constructor(
    private loadingWrapper: LoadingWrapperService,
    private client: ContentApiClient,
    private dialog: DialogService
  ) {}
  loadData() {
    const call$ = this.loadingWrapper.wrap(this.client.loadData());
    call$.subscribe(
      (data) => {
        this.content$.next(data.sort((a, b) => a.requestPath.localeCompare(b.requestPath)));
        this.selectedContent$.next(undefined);
      },
      (error) => {
        console.error(error);
        this.dialog.snackError(`Loading of static content data failed!\n${error.error.message || error.message}`);
      }
    );
  }

  saveData() {
    const call$ = this.loadingWrapper.wrap(this.client.saveData(this.snapshot));
    call$.subscribe(
      (_) => {
        this.dialog.snackSuccess('Static Content settings saved!');
      },
      (error) => {
        this.dialog.snackError(`Saving of static content data failed!\n${error.error.message || error.message}`);
      }
    );
  }

  selectContent(requestPath: string) {
    const cnt = this.content$.value.find((c) => c.requestPath === requestPath);
    this.selectedContent$.next({ ...cnt });
  }

  newContent() {
    const path = this.uniqueRequestPath();
    const content: StaticContent = {
      requestPath: path,
      fileSystemPath: 'contentPath',
      defaultFile: 'index.html',
      active: true,
      serveUnknownFileTypes: true,
      customContentTypes: 'json : application/json',
      isNew: true,
    };
    this.selectedContent$.next(content);
  }

  discardNewContent() {
    this.selectedContent$.next(undefined);
  }

  deleteContent(path: string) {
    const temp = this.content$.value
      .filter((cnt) => cnt.requestPath !== path)
      .sort((a, b) => a.requestPath.localeCompare(b.requestPath));

    this.content$.next(temp);
    this.selectedContent$.next(undefined);
    this.saveData();
  }

  saveContent(path: string, content: StaticContent) {
    const temp = this.content$.value.filter((s) => s.requestPath !== path);
    const newCntArray = [...temp, content].sort((a, b) => a.requestPath.localeCompare(b.requestPath));

    this.content$.next(newCntArray);
    this.saveData();

    const cnt = { ...content };
    cnt.isNew = false;
    this.selectedContent$.next(cnt);
  }

  private uniqueRequestPath() {
    let path = '';
    let id = this.content$.value.length;
    do {
      id++;
      path = `content-${id}`;
    } while (this.content$.value.findIndex((p) => p.requestPath === path) !== -1);

    return path;
  }
}
