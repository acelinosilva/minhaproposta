'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signout } from '@/app/login/actions';

export default function AdminSidebar({ userEmail }: { userEmail: string | undefined }) {
    const pathname = usePathname();

    const navItems = [
        { href: '/admin', label: '📊 Dashboard' },
        { href: '/admin/users', label: '👥 Usuários' },
        { href: '/admin/proposals', label: '📄 Propostas' },
        { href: '/settings', label: '⚙️ Configurações' },
    ];

    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <h2 className="sidebar-logo">
                    <span className="text-gradient">PropostaAI</span>
                    <span className="admin-badge">Admin</span>
                </h2>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
                <hr className="nav-divider" />
                <Link href="/dashboard" className="nav-item">🏠 Voltar ao App</Link>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <span className="user-email">{userEmail}</span>
                </div>
                <form action={signout}>
                    <button className="btn-secondary logout-btn">Sair</button>
                </form>
            </div>
        </aside>
    );
}
