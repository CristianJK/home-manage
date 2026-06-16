import {link as NavLink} from 'react-router';
export default function Link({ href, children, ...props }) {
  return (
    <NavLink to={href} {...props}>
      {children}
    </NavLink>
  )
}