import React from 'react';
import { Permission } from '../../types/Core.types';
import { getCurrentUser } from '../../utils/utilities';

const ConditionalRender = (props: { children: unknown; permission: string }) => {
  const permissions: Array<Permission> = getCurrentUser().permissions;

  const isPermitted =
    permissions.find((item: Permission) => item.permissionId === props.permission) !== undefined;

  // console.log('User is not permitted for permission id', permissions);

  return isPermitted ? <>{props.children}</> : null;
};

export default ConditionalRender;
