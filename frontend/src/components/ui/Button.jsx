export function Button({
  children,
  variant = 'primary',
  size = '',
  className = '',
  loading = false,
  icon,
  onClick,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span style={{ display:'inline-block', animation:'spin 0.8s linear infinite' }}>⟳</span> : icon}
      {children}
    </button>
  );
}
