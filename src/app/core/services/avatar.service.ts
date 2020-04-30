import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private readonly md5 = new Md5();

  public getAvatarUrl(email: string): string {
    return email
      ? `https://www.gravatar.com/avatar/${this.md5.appendAsciiStr(email).end()}`
      : 'assets/images/default-avatar.png';
  }
}
