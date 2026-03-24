
import { edge } from './edge';

export async function renderWelcomeEmail(params: {
  name: string;
  businessName: string;
  appName: string;
}) {
  const html = await edge.render('welcome', params);
  return html;
}
