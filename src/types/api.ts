export type ApiResource<T> = {
  data: T;
};

export type ApiCollection<T> = {
  data: T[];
};

export type UserSecuritySummary = {
  hasPassword: boolean;
  twoFactorEnabled: boolean;
  passkeysCount: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: string | null;
  avatarUrl: string | null;
  authProviders: string[];
  lastLoginAt: string | null;
  security: UserSecuritySummary;
};

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'invited' | 'disabled';
};

export type CurrentUserPayload = {
  user: User;
  activeWorkspace: Pick<WorkspaceSummary, 'id' | 'name' | 'slug'> | null;
  workspaces: WorkspaceSummary[];
};

export type SecurityPasskey = {
  id: string;
  name: string;
  createdAt: string | null;
  lastUsedAt: string | null;
};

export type SecurityPayload = {
  hasPassword: boolean;
  twoFactorEnabled: boolean;
  twoFactorConfirmedAt: string | null;
  passkeys: SecurityPasskey[];
  passkeysCount: number;
  authProviders: string[];
};

export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
  enabled: boolean;
};

export type NavigationPayload = {
  workspace: {
    id: string;
    name: string;
  };
  items: NavigationItem[];
};
