import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Công việc của tôi', description: 'Quản lý công việc cá nhân' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
