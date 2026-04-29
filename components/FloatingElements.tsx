'use client';

import { usePathname } from 'next/navigation';

export default function FloatingElements() {
  const pathname = usePathname();
  
  // Hide on admin and officer dashboards
  const isDashboard = pathname?.startsWith('/admin') || pathname?.startsWith('/officer');
  
  if (isDashboard) return null;

  return (
    <>
      {/* Fixed social media sidebar */}
      <div className="fixed-social-media">
        {[
          { href: 'https://facebook.com', icon: 'fab fa-facebook-f', bg: '#1877f2', title: 'Facebook' },
          { href: 'https://twitter.com',  icon: 'fab fa-twitter',    bg: '#1da1f2', title: 'Twitter' },
          { href: 'https://instagram.com',icon: 'fab fa-instagram',  bg: '#c13584', title: 'Instagram' },
          { href: 'https://youtube.com',  icon: 'fab fa-youtube',    bg: '#ff0000', title: 'YouTube' },
          { href: 'https://linkedin.com', icon: 'fab fa-linkedin-in',bg: '#0077b5', title: 'LinkedIn' },
        ].map(s => (
          <a
            key={s.title}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.title}
            className="social-icon"
            style={{ background: s.bg }}
          >
            <i className={s.icon} />
          </a>
        ))}
      </div>

    </>
  );
}
