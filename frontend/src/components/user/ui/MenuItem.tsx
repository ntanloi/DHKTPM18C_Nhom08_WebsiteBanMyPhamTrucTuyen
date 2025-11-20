interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  url?: string;
  onClick?: () => void;
}

export default function MenuItem({ icon, title, url, onClick }: MenuItemProps) {
  const content = (
    <>
      {icon}
      <span className="font-semibold">{title}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="icon flex items-center gap-1">
        {content}
      </button>
    );
  }

  return (
    <a className="icon flex items-center gap-1" href={url || '#'}>
      {content}
    </a>
  );
}
