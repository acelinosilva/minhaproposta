import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import './admin.css';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check if user is admin
    const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || userData?.role !== 'admin') {
        redirect('/dashboard');
    }

    return (
        <div className="admin-layout">
            <AdminSidebar userEmail={user.email} />

            <main className="main-content">
                <header className="admin-topbar glass-panel">
                    <h1>Área Administrativa</h1>
                </header>
                <div className="admin-page-content">
                    {children}
                </div>
            </main>
        </div>
    );
}
