import { prisma } from '@/services/db/client';
import { getAssetUrl } from '@/services/storage/asset-url';
import type { BoardMember as PublicBoardMember } from '@/components/sections/BoardOfDirectorsSection';
import type {
  BoardMember,
  Locale,
  PendingBoardSeat,
} from '@/components/admin/types';

export type PublicBoard = {
  members: PublicBoardMember[];
  pending: PublicBoardMember[];
};

/**
 * The board as the public page needs it, read from the same tables the admin
 * writes to. The heading and subtitle stay in the static content: they are
 * i18n copy, not board data.
 *
 * Names are not translated — a person is called the same in both languages —
 * so only the role and the description come from `translations`.
 */
export async function getPublicBoard(locale: Locale): Promise<PublicBoard> {
  const [members, pendingSeats] = await Promise.all([
    prisma.boardMember.findMany({ orderBy: { order: 'asc' } }),
    prisma.pendingBoardSeat.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return {
    members: members.map((member): PublicBoardMember => {
      const translations = member.translations as unknown as Record<
        Locale,
        Partial<BoardMember['translations']['en']> | undefined
      >;

      return {
        id: String(member.id),
        name: member.name,
        role: translations[locale]?.role ?? '',
        description: translations[locale]?.description,
        // The portrait shows the person, so it carries their name; a decorative
        // alt would hide who it is from anyone using a screen reader.
        image: { src: getAssetUrl(member.image), alt: member.name },
      };
    }),
    pending: pendingSeats.map((seat): PublicBoardMember => {
      const translations = seat.translations as unknown as Record<
        Locale,
        Partial<PendingBoardSeat['translations']['en']> | undefined
      >;

      return {
        id: String(seat.id),
        name: seat.name,
        role: translations[locale]?.role ?? '',
        // No alt: the placeholder is the same brand icon on every empty seat,
        // and the role underneath already says what the seat is.
        image: { src: getAssetUrl(seat.image) },
      };
    }),
  };
}
