import './HowItWorks.css';

export function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Escolhe um desafio',
            description: 'Exercícios organizados por tema e nível, seguindo o programa da disciplina.'
        },
        {
            number: '02',
            title: 'Escreve o teu código',
            description: 'Editor integrado com realce de sintaxe para Python. Podes também fazer upload de um ficheiro .py.'
        },
        {
            number: '03',
            title: 'Recebe feedback da IA',
            description: 'Análise detalhada — o que está bem, o que melhorar, e porquê. Sem dar a resposta.'
        }
    ];

    return (
        <section id="como-funciona" className="how-it-works">
            <div className="how-it-works-container">
                <h2 className="section-subtitle">COMO FUNCIONA</h2>
                
                <div className="steps-list">
                    {steps.map((step, index) => (
                        <div className="step-item" key={index}>
                            <div className="step-number">{step.number}</div>
                            <div className="step-content">
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
