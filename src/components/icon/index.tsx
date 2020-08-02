import React from 'react';

interface IProps {
  type: string;
  // onClick?: React.MouseEvent<SVGSVGElement, MouseEvent>;
}

export default ({ type, ...rest }: IProps) => {
  return (
    <svg className="icon" aria-hidden="true" {...rest}>
      <use xlinkHref={`#${type}`} fontSize="20"></use>
    </svg>
  );
};
