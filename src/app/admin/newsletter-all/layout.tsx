import { isAuthenticated } from '@/lib/auth';
import { AdminHeader } from '@/components/AdminHeader';

export default async function NewsletterAllLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { username } = await isAuthenticated();
  
  return (
    <div>
      <AdminHeader username={username} />
      {children}
    </div>
  );
}