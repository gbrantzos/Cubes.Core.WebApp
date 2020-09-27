import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { StaticContent } from '@features/settings/services/content.model';
import { DialogService } from '@shared/services/dialog.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ContentApiClient {
  private baseUrl;

  constructor(private http: HttpClient, private dialog: DialogService, config: ConfigurationService) {
    this.baseUrl = `${config.apiUrl}/configuration/Cubes.Core.Web.StaticContent.StaticContentSettings`;
  }

  loadData(): Observable<StaticContent[]> {
    const settings$ = this.http.get<{ content: CubesStaticContent[] }>(this.baseUrl).pipe(
      map((data) =>
        data.content.map((c) => {
          const content: StaticContent = {
            requestPath: c.requestPath,
            active: c.active,
            fileSystemPath: c.fileSystemPath,
            defaultFile: c.defaultFile,
            serveUnknownFileTypes: c.serveUnknownFileTypes,
            customContentTypes: Object.keys(c.customContentTypes)
              .map((key) => `${key} : ${c.customContentTypes[key]}`)
              .join('\n'),
          };

          return content;
        })
      ),
      catchError((error, _) => {
        this.dialog.snackError(`Failed to load settings!\n\n${error.error}`);
        return of([]);
      })
    );

    return settings$;
  }

  saveData(data: StaticContent[]): Observable<string> {
    const staticContent = data.map((d) => {
      const contentTypes: { [type: string]: string } = {};

      d.customContentTypes?.split('\n').forEach((line) => {
        const index = line.indexOf(':');
        if (index !== -1) {
          const key = line.substr(0, index).trim();
          const value = line.substr(index + 1).trim();
          contentTypes[key] = value;
        }
      });

      return {
        requestPath: d.requestPath,
        fileSystemPath: d.fileSystemPath,
        defaultFile: d.defaultFile,
        active: d.active,
        serveUnknownFileTypes: d.serveUnknownFileTypes,
        customContentTypes: contentTypes,
      } as CubesStaticContent;
    });

    return this.http
      .post(
        this.baseUrl,
        { content: staticContent },
        {
          headers: new HttpHeaders({ 'Content-Type': 'text/plain' }),
          observe: 'body',
          responseType: 'text'
        }
      )
      .pipe(
        catchError((error, _) => {
          console.log(error);
          return throwError(error);
        })
      );
  }
}

interface CubesStaticContent {
  requestPath: string;
  active: boolean;
  fileSystemPath: string;
  defaultFile: string;
  serveUnknownFileTypes: boolean;
  customContentTypes?: {
    [type: string]: string;
  };
}
