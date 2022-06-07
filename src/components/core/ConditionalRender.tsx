import React from 'react';
import { useSelector } from 'react-redux';
import { Permission } from '../../types/Core.types';
import { StateReducer } from '../../types/Reducer.types';

const ConditionalRender = (props: { children: unknown; permission: string }) => {
  const permissions: Array<Permission> = useSelector(
    (state: StateReducer) => state.auth.permissions
  );

  return permissions.find((item: Permission) => item.permissionId === props.permission) ? (
    <>{props.children}</>
  ) : null;
};

export default ConditionalRender;
