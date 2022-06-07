import { Permission } from './Core.types';

interface User {
  token: string;
  name: string;
  permissions: Array<Permission>;
  userAccess: unknown;
}

export type { User };
