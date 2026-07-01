import {
  FaArrowUpFromBracket,
  FaEye,
  FaFilePdf,
  FaImage,
} from 'react-icons/fa6';
import { mediaAssets } from '@/components/admin/mock-data';
import { ActionRow, Panel, StatusBadge } from '@/components/admin/ui';

export default function AssetsAdminSection() {
  return (
    <div className='grid gap-5 xl:grid-cols-[1fr_360px]'>
      <Panel title='Media library' eyebrow='Hero / assets visuales'>
        <div className='grid gap-3 md:grid-cols-3'>
          {mediaAssets.map((asset) => (
            <div
              key={asset.id}
              className='rounded-md border border-neutral-200 p-4'
            >
              <div className='flex h-24 items-center justify-center rounded-md bg-neutral-100 text-brand'>
                {asset.type === 'video' ? (
                  <FaEye className='h-8 w-8' />
                ) : asset.type === 'document' ? (
                  <FaFilePdf className='h-8 w-8' />
                ) : (
                  <FaImage className='h-8 w-8' />
                )}
              </div>
              <p className='mt-3 font-black text-neutral-950'>{asset.name}</p>
              <p className='text-xs text-neutral-500'>{asset.usage}</p>
              <p className='mt-2 truncate text-xs text-neutral-500'>
                {asset.path}
              </p>
              <div className='mt-4 flex items-center justify-between gap-3'>
                <StatusBadge status={asset.status} />
                <ActionRow />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title='Subir asset' eyebrow='Archivos'>
        <div className='flex h-40 flex-col items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-50 px-4 text-center'>
          <FaArrowUpFromBracket className='h-7 w-7 text-brand' />
          <p className='mt-3 text-sm font-bold text-neutral-950'>
            Sube imagen, video o PDF
          </p>
          <p className='mt-1 text-xs text-neutral-500'>
            Quedara disponible para Hero, bandas, logos y documentos.
          </p>
          <input
            type='file'
            className='mt-3 max-w-full text-xs text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white'
          />
        </div>
      </Panel>
    </div>
  );
}
