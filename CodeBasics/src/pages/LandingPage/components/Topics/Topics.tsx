import './Topics.css';

export function Topics() {
    const topics = [
        'variáveis', 'tipos de dados', 'condicionais', 'ciclos for', 'ciclos while', 
        'funções', 'listas', 'dicionários', 'strings', 'recursividade'
    ];

    return (
        <section className="topics">
            <div className="topics-container">
                <h2 className="section-subtitle">TÓPICOS ABORDADOS</h2>
                
                <div className="topics-grid">
                    {topics.map((topic, index) => (
                        <div className="topic-badge" key={index}>
                            {topic}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
