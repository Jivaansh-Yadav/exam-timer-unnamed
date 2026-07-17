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
      time: "09:10:00",
      imageUrl: "https://github-production-user-asset-6210df.s3.amazonaws.com/187954222/623136048-52c3cce7-fc0d-4ba3-85b3-cf5a3e0340be.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260717T093804Z&X-Amz-Expires=300&X-Amz-Signature=725319f06e52618fad189db6491b0d0048e2f37f1cb3fae9aa6deca00244324d&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
      caption: "When you already know you're cooked!",
      width: 475,
      height: 445,
    },
    {
      time: "09:20:00",
      imageUrl: "https://github-production-user-asset-6210df.s3.amazonaws.com/187954222/623147926-b57359d1-fc6a-4b2c-9e36-1ede7fa63de0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260717T094511Z&X-Amz-Expires=300&X-Amz-Signature=3a558c851f6f41f1b92748e42c0aae8b7a9db305da040be428b1c0e90b789ce7&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
      caption: "Last 30 minutes left!",
      width: 455,
      height: 455,
    },
    {
      time: "09:40:00",
      imageUrl: "https://github-production-user-asset-6210df.s3.amazonaws.com/187954222/623132719-6ff4e2dd-fd20-4410-803e-788bb15b0be8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260717T093857Z&X-Amz-Expires=300&X-Amz-Signature=81ff0ea1775c5a7493599fe4a98adeb8ae9753193ac4e6b1fa48f71b22d9ef78&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
      caption: "Last 10 minutes left!",
      width: 420,
      height: 420,
    },
    {
      time: "09:45:00",
      imageUrl: "https://github-production-user-asset-6210df.s3.amazonaws.com/187954222/623132719-6ff4e2dd-fd20-4410-803e-788bb15b0be8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260717T093857Z&X-Amz-Expires=300&X-Amz-Signature=81ff0ea1775c5a7493599fe4a98adeb8ae9753193ac4e6b1fa48f71b22d9ef78&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
      caption: "Last 5 minutes left!",
      width: 486,
      height: 486,
    },
    {
      time: "09:50:00",
      imageUrl: "https://github-production-user-asset-6210df.s3.amazonaws.com/187954222/623134096-e0a451f9-6309-4a2a-aeaf-a823fa637743.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260717%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260717T093949Z&X-Amz-Expires=300&X-Amz-Signature=2d94c49bfcee37ac8415f8888616312a68d81fef6fd9f901167ea43518107430&X-Amz-SignedHeaders=host&response-content-type=image%2Fpng",
      caption: "Kaisa gya paper?",
      width: 431,
      height: 348,
    },
  ];
  
