// Свои SVG-иконки в духе XP: объём градиентом, тёмный контур. Ассетов Microsoft нет.
import { useId } from 'react';

export type IconName =
  | 'projects' | 'computer' | 'about' | 'resume' | 'services' | 'reviews' | 'icq' | 'paint' | 'dashboard'
  | 'github' | 'folder' | 'logo' | 'speaker' | 'mute' | 'external' | 'globe';

type Props = { name: IconName; size?: number; className?: string };

export function Icon({ name, size = 32, className }: Props) {
  const uid = useId().replace(/:/g, '');
  const g = (n: string) => `${uid}${n}`;
  const grad = (id: string, from: string, to: string, vertical = true) => (
    <linearGradient id={g(id)} x1="0" y1="0" x2={vertical ? '0' : '1'} y2={vertical ? '1' : '0'}>
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
  const body = (() => {
    switch (name) {
      case 'projects':
      case 'globe':
        return (
          <>
            <defs>{grad('a', '#7fc4ff', '#1b5fd1')}{grad('b', '#9be27a', '#3c8f2a')}</defs>
            <circle cx="16" cy="16" r="12.5" fill={`url(#${g('a')})`} stroke="#123f8f" />
            <path d="M8 11c3-1 4 2 7 1s2-4 5-3 2 4 0 6-5 1-6 4 1 5-2 6c-3-1-5-4-5-7s-2-4 1-7z" fill={`url(#${g('b')})`} opacity=".9" />
            <ellipse cx="12" cy="9" rx="5" ry="2.5" fill="#fff" opacity=".35" />
            {name === 'projects' && <path d="M19 19h10v9H19z" fill="#fff" stroke="#123f8f" />}
            {name === 'projects' && <path d="M19 19h10v2.5H19z" fill="#2c6be0" />}
          </>
        );
      case 'computer':
        return (
          <>
            <defs>{grad('a', '#f4f4f0', '#b9b6aa')}{grad('b', '#4f93ff', '#0d3c9e')}</defs>
            <rect x="4" y="4" width="24" height="18" rx="2" fill={`url(#${g('a')})`} stroke="#5d5a50" />
            <rect x="7" y="7" width="18" height="12" fill={`url(#${g('b')})`} />
            <path d="M8 8h9l-9 7z" fill="#fff" opacity=".25" />
            <path d="M12 22h8l2 4H10z" fill={`url(#${g('a')})`} stroke="#5d5a50" />
            <rect x="6" y="26" width="20" height="3" rx="1" fill="#d8d5c9" stroke="#5d5a50" />
          </>
        );
      case 'about':
        return (
          <>
            <defs>{grad('a', '#fffdf2', '#e3dcc0')}{grad('b', '#ffbf6b', '#e0732a')}</defs>
            <rect x="3" y="6" width="26" height="20" rx="2" fill={`url(#${g('a')})`} stroke="#7a6b45" />
            <circle cx="11" cy="14" r="3.5" fill={`url(#${g('b')})`} stroke="#8a4a14" />
            <path d="M5.5 23c.8-3.5 3-5 5.5-5s4.7 1.5 5.5 5z" fill={`url(#${g('b')})`} stroke="#8a4a14" />
            <path d="M19 12h7M19 16h7M19 20h5" stroke="#7a6b45" strokeWidth="1.6" />
          </>
        );
      case 'resume':
      case 'services':
        return (
          <>
            <defs>{grad('a', '#ffffff', '#dfe7f2')}</defs>
            <path d="M7 3h14l5 5v21H7z" fill={`url(#${g('a')})`} stroke="#4a5a74" />
            <path d="M21 3v5h5" fill="#c9d6ea" stroke="#4a5a74" />
            <path d="M10 12h12M10 16h12M10 20h12M10 24h8" stroke="#6b84ad" strokeWidth="1.4" />
            {name === 'services' && <circle cx="23" cy="24" r="5" fill="#f5c542" stroke="#9a7212" />}
            {name === 'services' && <path d="M21.5 22.5h3M21.5 25.5h3M23 21v6" stroke="#7a5a0e" strokeWidth="1.2" />}
          </>
        );
      case 'reviews':
        return (
          <>
            <defs>{grad('a', '#fff3a3', '#f0a91c')}</defs>
            <path d="M16 3l3.9 8 8.6 1.2-6.3 6 1.6 8.6L16 22.7l-7.8 4.1 1.6-8.6-6.3-6L12.1 11z" fill={`url(#${g('a')})`} stroke="#9a6206" strokeLinejoin="round" />
            <path d="M12 12l4-7 2 5z" fill="#fff" opacity=".45" />
          </>
        );
      case 'icq':
        return (
          <>
            <defs>{grad('a', '#ffffff', '#d6e9d2')}{grad('b', '#7be05f', '#2b9a1c')}</defs>
            <path d="M4 6h22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H13l-6 5v-5H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill={`url(#${g('a')})`} stroke="#3f6b38" />
            <circle cx="25" cy="7" r="5" fill={`url(#${g('b')})`} stroke="#1f6614" />
            <path d="M8 12h12M8 16h8" stroke="#5c8a55" strokeWidth="1.6" />
          </>
        );
      case 'paint':
        return (
          <>
            <defs>{grad('a', '#fbf1d9', '#d9b97a')}</defs>
            <path d="M16 4C8 4 3 9.5 3 16s5 12 11 12c2.5 0 3-1.6 2.2-3-.8-1.5.2-3 2-3H22c4 0 7-2.5 7-6.5C29 9 23.5 4 16 4z" fill={`url(#${g('a')})`} stroke="#7a5a26" />
            <circle cx="10" cy="13" r="2.4" fill="#e23b3b" />
            <circle cx="15" cy="9" r="2.4" fill="#f5c542" />
            <circle cx="21" cy="10" r="2.4" fill="#3a8be8" />
            <circle cx="9.5" cy="20" r="2.4" fill="#37a63a" />
          </>
        );
      case 'dashboard':
        return (
          <>
            <defs>{grad('a', '#ffffff', '#dfe7f2')}{grad('b', '#6fb2ff', '#1c5fd4')}</defs>
            <rect x="3" y="4" width="26" height="24" rx="2" fill={`url(#${g('a')})`} stroke="#3c5a8c" />
            <rect x="7" y="17" width="4" height="7" fill={`url(#${g('b')})`} />
            <rect x="14" y="12" width="4" height="12" fill={`url(#${g('b')})`} />
            <rect x="21" y="8" width="4" height="16" fill="#3bb04a" />
          </>
        );
      case 'github':
        return (
          <>
            <defs>{grad('a', '#5b6472', '#1f242c')}</defs>
            <rect x="3" y="5" width="26" height="22" rx="3" fill={`url(#${g('a')})`} stroke="#0f1216" />
            <path d="M12 11l-5 5 5 5M20 11l5 5-5 5M17.5 9.5l-3 13" stroke="#9fe870" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 'folder':
        return (
          <>
            <defs>{grad('a', '#ffe9a1', '#f2bd38')}{grad('b', '#fff3c4', '#f6cf5c')}</defs>
            <path d="M3 8a2 2 0 0 1 2-2h7l3 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={`url(#${g('a')})`} stroke="#9a7212" />
            <path d="M3 13h26v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={`url(#${g('b')})`} stroke="#9a7212" />
          </>
        );
      case 'logo':
        return (
          <>
            <defs>{grad('a', '#ffe08a', '#f08a24')}</defs>
            <circle cx="16" cy="16" r="13" fill={`url(#${g('a')})`} stroke="#a14d0b" />
            <path d="M9 10l7 13 7-13" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </>
        );
      case 'speaker':
      case 'mute':
        return (
          <>
            <path d="M6 12h5l7-6v20l-7-6H6z" fill="#f2f2f2" stroke="#2b3a55" />
            {name === 'speaker'
              ? <path d="M21 11c2 2 2 8 0 10M24 8c4 4 4 12 0 16" stroke="#f2f2f2" strokeWidth="2" fill="none" strokeLinecap="round" />
              : <path d="M21 12l7 8M28 12l-7 8" stroke="#ff5a4f" strokeWidth="2.4" strokeLinecap="round" />}
          </>
        );
      case 'external':
        return <path d="M13 7H7v18h18v-6M18 6h8v8M26 6L14 18" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    }
  })();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      {body}
    </svg>
  );
}
