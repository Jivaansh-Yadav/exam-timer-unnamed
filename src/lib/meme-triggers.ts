export type MemeTrigger = {
  time: string; // "HH:MM" or "HH:MM:SS" format
  imageUrl: string;
  caption: string;
  width?: number; // optional: pixel width for the meme
  height?: number; // optional: pixel height for the meme
};

const embeddedMemeImage =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 675">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#DFF4E6"/>
          <stop offset="1" stop-color="#F7B8A8"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#3C3830" flood-opacity="0.18"/>
        </filter>
      </defs>
      <rect width="900" height="675" fill="url(#bg)"/>
      <circle cx="450" cy="315" r="170" fill="#F4F1EA" filter="url(#shadow)"/>
      <circle cx="390" cy="275" r="18" fill="#3C3830"/>
      <circle cx="510" cy="275" r="18" fill="#3C3830"/>
      <path d="M360 370 Q450 445 540 370" fill="none" stroke="#D9534F" stroke-width="24" stroke-linecap="round"/>
      <text x="450" y="585" text-anchor="middle" font-family="Schibsted Grotesk, Arial, sans-serif" font-size="54" font-weight="700" fill="#3C3830">Keep going</text>
    </svg>
  `);

export const previewMemeTrigger: MemeTrigger = {
  time: "preview",
  imageUrl: embeddedMemeImage,
  caption: "Meme popup test is working.",
};

export const memeTriggers: MemeTrigger[] = [
  {
    time: "21:18:00",
    imageUrl: embeddedMemeImage,
    caption: "Tiny stretch break, then back to it.",
  },
  {
    time: "21:45:00",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR48cVhHUA5WwIQUaMtuexowNQkkQoZMVenxQS8WS3chA&s",
    caption: "Saara Ghee khatam",
  },
];
