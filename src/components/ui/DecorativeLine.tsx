export default function DecorativeLine({ marginTop }: { marginTop?: number } = { marginTop: 4 }) {
  return (
   <span className={`mt-${marginTop} block h-1 w-12 rounded-full bg-brand`} aria-hidden="true" />
  );
}
