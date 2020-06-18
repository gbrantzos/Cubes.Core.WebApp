export interface User {
  userName:         string;
  displayName:      string;
  roles?:           string;
  isNew?:           boolean;
  changedPassword?: string;
}
