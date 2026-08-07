import { redirect } from 'next/navigation';

export default function ScoringRedirect() {
  redirect('/dashboard/scoring-rules');
}