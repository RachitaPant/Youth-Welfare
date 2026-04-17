import PageHero from '@/components/PageHero';
import GalleryClient from '@/components/GalleryClient';

const galleryImages = [
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.26 (1).jpeg', alt: 'Youth Welfare Event', description: 'Award Ceremony during the Khel Mahakumbh District Level Meet in Dehradun.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.26.jpeg',     alt: 'Youth Welfare Event', description: 'State-Level Volley ball Championship finals held at the Maharana Pratap Sports College.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.27 (1).jpeg', alt: 'Youth Welfare Event', description: 'Youth Leadership and Community Service workshop for volunteers in Haridwar.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.27 (2).jpeg', alt: 'Youth Welfare Event', description: 'Cultural Performance by participants at the State Youth Festival 2026.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.27.jpeg',     alt: 'Youth Welfare Event', description: 'Martial Arts demonstration by female athletes promoting self-defense.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.28 (1).jpeg', alt: 'Youth Welfare Event', description: 'Prize distribution for the Under-17 Athletics sprint runners.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.28 (2).jpeg', alt: 'Youth Welfare Event', description: 'Team Uttarakhand training session for the upcoming National Games.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.28.jpeg',     alt: 'Youth Welfare Event', description: 'Inauguration of the new District Sports Office in Almora.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.29 (1).jpeg', alt: 'Youth Welfare Event', description: 'Interaction session between professional coaches and budding athletes.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.29 (2).jpeg', alt: 'Youth Welfare Event', description: 'Volunteers participating in the statewide Clean Uttarakhand campaign.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.29.jpeg',     alt: 'Youth Welfare Event', description: 'District level Kabaddi tournament showcasing local talent.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.30 (1).jpeg', alt: 'Youth Welfare Event', description: 'Closing ceremony highlights from the Winter Adventure Camp.' },
  { src: '/images/gallery/WhatsApp Image 2026-02-24 at 18.07.30.jpeg',     alt: 'Youth Welfare Event', description: 'Traditional Folk Dance competition entry from Pithoragarh.' },
  { src: '/images/gallery/new.jpeg',                                        alt: 'Youth Welfare Event', description: 'Modern training facilities at the newly upgraded Youth Center.' },
];

export const metadata = {
  title: 'Gallery | Youth Welfare & PRD, Uttarakhand',
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        hindiTitle="फोटो गैलरी"
        title="Photo Gallery — Youth Welfare & PRD Department"
        subtitle="Capturing moments from youth programs, events, and initiatives across Uttarakhand"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        stats={[
          { value: '13',  label: 'Districts' },
          { value: '50+', label: 'Events' },
          { value: '2026', label: 'Edition' },
        ]}
      />

      <GalleryClient images={galleryImages} />
    </>
  );
}
