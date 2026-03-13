type PolicyItem = string | { label: string; text: string };

type PolicyListProps = {
  items: PolicyItem[];
};

export function PolicyList({ items }: PolicyListProps) {
  return (
    <ul className="space-y-2" style={{ listStyle: 'none', paddingLeft: 0 }}>
      {items.map((item, i) => {
        const isObj = typeof item === 'object' && item !== null;
        return (
          <li key={i} className="flex items-start gap-2">
            <span
              className="mt-[7px] flex-shrink-0 w-1.5 h-1.5 rounded-full bg-theme-kelly-green"
            />
            <span className="text-gray-300">
              {isObj ? (
                <>
                  <strong className="text-white">{item.label}:</strong>{' '}
                  {item.text}
                </>
              ) : item}
            </span>
          </li>
        );
      })}
    </ul>
  );
}