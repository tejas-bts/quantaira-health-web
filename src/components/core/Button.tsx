/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

const Button = ({
  icon,
  label,
  orientation,
  size,
  onClick,
  type,
  shape,
  cssWidth,
  cssBorder,
  backgroundColor,
}: {
  icon?: string;
  label?: string;
  orientation: 'vertical' | 'horizontle';
  size: 'lg' | 'md' | 'sm';
  type: 'primary' | 'secondary' | 'ternary';
  onClick: any;
  shape: 'rounded' | 'rectangular';
  cssWidth?: string;
  cssBorder?: string;
  backgroundColor?: string;
}) => {
  const style: { width?: string; border?: string; backgroundColor?: string } = {
    width: cssWidth,
    backgroundColor: backgroundColor,
  };
  if (cssBorder?.length) style.border = cssBorder;
  if (backgroundColor?.length) style.backgroundColor = backgroundColor;
  return (
    <button
      className={`quantaira-button ${orientation} ${size} ${type} ${shape} ${
        !label && 'p-1'
      }`}
      onClick={onClick}
      style={style}
    >
      {icon && <div style={{ backgroundImage: `url(${icon})` }} />}
      {label}
    </button>
  );
};

export default Button;
