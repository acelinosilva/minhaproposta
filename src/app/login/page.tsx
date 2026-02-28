import { login, signup } from './actions'
import './login.css'

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string }>
}) {
    const sp = await searchParams
    const error = sp?.error

    return (
        <div className="login-container">
            <div className="login-box glass-panel">
                <div className="login-header">
                    <h1 className="text-gradient">PropostaAI</h1>
                    <p>Automação inteligente de propostas comerciais.</p>
                </div>

                {error && <div className="error-message glass-card">{error}</div>}

                <form className="login-form">
                    <div className="form-group">
                        <label className="label" htmlFor="name">Nome (apenas cadastro)</label>
                        <input
                            className="input-field"
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="email">Email</label>
                        <input
                            className="input-field"
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="exemplo@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label className="label" htmlFor="password">Senha</label>
                        <input
                            className="input-field"
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="********"
                        />
                    </div>

                    <div className="button-group">
                        <button className="btn-primary" formAction={login}>
                            Entrar
                        </button>
                        <button className="btn-secondary" formAction={signup}>
                            Criar Conta
                        </button>
                    </div>
                </form>
            </div>

            <div className="features-preview">
                <h2>Por que usar o PropostaAI?</h2>
                <ul>
                    <li>✨ Crie propostas em segundos.</li>
                    <li>🎯 Preços sugeridos por IA.</li>
                    <li>📄 Exportação profissional em PDF.</li>
                </ul>
            </div>
        </div>
    )
}
