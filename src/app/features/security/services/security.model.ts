export interface User {
  userName:         string;
  displayName:      string;
  email?:           string;
  roles?:           string;
  isNew?:           boolean;
  changedPassword?: string;
}

export interface Role {
  code:        string;
  description: string;
  isSystem:    boolean;
}
