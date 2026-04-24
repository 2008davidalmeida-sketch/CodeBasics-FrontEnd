import './CodeMockup.css';

export function CodeMockup() {
    return (
        <section className="code-mockup-section">
            <div className="code-mockup-container">
                <div className="code-window">
                    <div className="window-header">
                        <div className="window-controls">
                            <span className="control-dot close"></span>
                            <span className="control-dot minimize"></span>
                            <span className="control-dot maximize"></span>
                        </div>
                        <div className="window-title">exercicio_03.py</div>
                    </div>
                    
                    <div className="window-body">
                        <pre className="code-content">
                            <code>
                                <span className="comment"># verifica se um número é primo</span>{'\n'}
                                <span className="keyword">def</span> <span className="function">is_primo</span>(n):{'\n'}
                                {'    '}<span className="keyword">for</span> i <span className="keyword">in</span> <span className="function">range</span>(<span className="number">2</span>, n):{'\n'}
                                {'        '}<span className="keyword">if</span> n % i == <span className="number">0</span>:{'\n'}
                                {'            '}<span className="keyword">return</span> <span className="boolean">False</span>{'\n'}
                                {'    '}<span className="keyword">return</span> <span className="boolean">True</span>
                            </code>
                        </pre>
                        
                        <div className="ai-feedback-box">
                            <div className="feedback-label">FEEDBACK DA IA</div>
                            <p className="feedback-text">
                                A lógica está correta. Podes otimizar o ciclo usando <code>range(2, int(n**0.5)+1)</code> — só precisas de verificar até à raiz quadrada de n, o que é muito mais eficiente para números grandes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
