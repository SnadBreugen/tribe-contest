import { useEffect } from 'react';
import { useStore } from '../../lib/store';
import { extractBannerColors } from '../../lib/colors';

interface Props {
  onColorsExtracted?: (colors: { primary: string; secondary: string; tertiary: string }) => void;
}

export function Banner({ onColorsExtracted }: Props) {
  const { contest } = useStore();

  useEffect(() => {
    extractBannerColors(contest.bannerUrl).then(colors => {
      if (colors && onColorsExtracted) onColorsExtracted(colors);
    });
  }, [contest.bannerUrl, onColorsExtracted]);

  return (
    <div
      className="aspect-video w-full rounded-3xl overflow-hidden bg-bg-card relative"
      style={{
        backgroundImage: `url(${contest.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-bg/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}