import type { APIRoute } from 'astro';
import facts from '../../data/facts.json';

export const GET: APIRoute = () => {
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  
  return new Response(JSON.stringify(randomFact), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
