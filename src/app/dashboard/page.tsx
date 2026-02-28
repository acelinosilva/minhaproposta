import SmartForm from '@/components/SmartForm';

export default function DashboardPage() {
    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1 className="text-gradient">Painel PropostaAI</h1>
                    <p className="text-muted">Bem-vindo(a)! Crie ou gerencie suas propostas comerciais.</p>
                </div>
            </div>

            <div className="dashboard-grid">
                <SmartForm />
            </div>
        </div>
    );
}
