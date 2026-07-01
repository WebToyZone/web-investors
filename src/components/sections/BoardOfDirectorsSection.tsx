import SectionHeader from "@/components/ui/SectionHeader";
import PersonCard from "@/components/ui/PersonCard";

/**
 * Data shapes for the Board of Directors section.
 *
 * Fed statically from `data/investors.ts` for now; plain serialisable fields
 * keep it ready to come from a Prisma-backed CMS later.
 */
export interface BoardMember {
  name: string;
  role: string;
  description?: string;
  image: { src: string; alt?: string };
}

export interface BoardContent {
  /** Accent (red) word of the heading, e.g. "Directors". */
  accent: string;
  /** Remaining heading words, e.g. "Board of". */
  title: string;
  subtitle: string;
  /** Appointed members shown with a portrait. */
  members: BoardMember[];
  /** Seats to be confirmed, shown with the brand placeholder icon. */
  pending: BoardMember[];
}

export interface BoardOfDirectorsSectionProps {
  content: BoardContent;
}

/**
 * Board of Directors section: appointed members in a row of portraits and a
 * second row of "to be confirmed" seats. Static / presentational — safe as a
 * Server Component.
 */
export default function BoardOfDirectorsSection({
  content,
}: BoardOfDirectorsSectionProps) {
  const { accent, title, subtitle, members, pending } = content;

  return (
    <section
      id="board-of-directors"
      aria-labelledby="board-of-directors-title"
      className="scroll-mt-24 bg-neutral-100"
    >
      <div className="container-site py-20 lg:py-24">
        <SectionHeader
          accent={accent}
          title={title}
          accentPosition="end"
          subtitle={subtitle}
          titleId="board-of-directors-title"
        />

        {/* Appointed members */}
        <ul className="mt-12 lg:mt-16 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 xl:grid-cols-5">
          {members.map((member) => (
            <li key={member.name}>
              <PersonCard
                name={member.name}
                role={member.role}
                description={member.description}
                image={member.image}
              />
            </li>
          ))}
        </ul>

        {/* Seats to be confirmed */}
        {pending.length > 0 ? (
          <ul className="mx-auto mt-10 lg:mt-16 grid max-w-3xl grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3">
            {pending.map((seat) => (
              <li key={seat.role}>
                <PersonCard
                  name={seat.name}
                  role={seat.role}
                  description={seat.description}
                  image={seat.image}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
