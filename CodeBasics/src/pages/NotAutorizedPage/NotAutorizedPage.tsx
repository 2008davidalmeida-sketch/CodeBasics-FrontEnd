import { AccessDeniedCard } from './components/AccessDeniedCard'
import './NotAutorizedPage.css'

export default function NotAutorizedPage() {
    return (
        <div className="not-authorized-container">
            <AccessDeniedCard
                title="Acesso não autorizado"
                message="Para garantires o acesso à plataforma, deves utilizar um e-mail institucional das Escolas de Mangualde."
            />

            {/* Background floating elements for extra premium feel */}
            <div className="floating-shape shape-1"></div>
            <div className="floating-shape shape-2"></div>
        </div>
    )
}
