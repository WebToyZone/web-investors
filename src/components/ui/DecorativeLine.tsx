const marginTopClassName = {
  2: 'mt-2',
  4: 'mt-4',
} as const;

type DecorativeLineMarginTop = keyof typeof marginTopClassName;

export default function DecorativeLine({
  marginTop = 4,
}: {
  marginTop?: DecorativeLineMarginTop;
}) {
  return (
    <span
      className={`${marginTopClassName[marginTop]} block h-1 w-12 rounded-full bg-brand`}
      aria-hidden="true"
    />
  );
}
