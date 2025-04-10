import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

export default function SimuladorPejotizacao() {
  const [salario, setSalario] = useState(10000);
  const [colaboradores, setColaboradores] = useState(10);
  const [meses, setMeses] = useState(12);
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const totalSalario = salario * colaboradores;

    const custoCLT = totalSalario * 1.5;
    const custoPJ = totalSalario * 1.2;
    const economiaMensal = custoCLT - custoPJ;
    const economiaTotal = economiaMensal * meses;
    const previdencia = economiaMensal * 0.5;
    const recebivelPJ = custoPJ - previdencia;

    const contabilidadeMensal = 369;
    const impostoMensal = (recebivelPJ / colaboradores) * 0.06;

    const ganhoPJMensal = (recebivelPJ / colaboradores) - impostoMensal - contabilidadeMensal + (previdencia / colaboradores);

    const inss = Math.min(salario * 0.14, 908.86);
    const baseIRRF = salario - inss;
    const irrf = baseIRRF > 4664.68 ? (baseIRRF * 0.275 - 884.96) : 0;
    const salarioLiquidoCLT = salario - inss - irrf;

    const ganhoMensalExtra = ganhoPJMensal - salarioLiquidoCLT;

    const contabilidade = contabilidadeMensal * meses * colaboradores;
    const impostos = impostoMensal * meses * colaboradores;

    const ganhoPJ = (recebivelPJ * meses + previdencia * meses) - contabilidade - impostos;

    const inssPatronal = totalSalario * meses * 0.20;
    const fgts = totalSalario * meses * 0.08;
    const ferias = totalSalario * meses * 0.1111;
    const decimo = totalSalario * meses * 0.0833;
    const multa = fgts * 0.4;
    const avisoPrevio = salario * colaboradores;

    const totalAcao = inssPatronal + fgts + ferias + decimo + multa + avisoPrevio;
    const risco = totalAcao * 0.68;
    const seguro = risco * 0.15;

    const economiaLiquida = economiaTotal - seguro;

    // Aposentadoria estimativas
    const contribuicaoINSSMensal = Math.min(salario * 0.14, 908.86);
    const tempoContribuicao = 35;
    const totalINSS = contribuicaoINSSMensal * 12 * tempoContribuicao;
    const estimativaAposentadoriaINSS = 6500;

    const contribuicaoPrevidenciaPrivada = (previdencia / colaboradores);
    const acumuladoPrivado = Array.from({ length: tempoContribuicao * 12 }).reduce((acc) => acc * 1.005 + contribuicaoPrevidenciaPrivada, 0);

    setResultado({
      custoCLT, custoPJ, economiaMensal, economiaTotal,
      economiaLiquida, ganhoPJ, risco, seguro, totalAcao,
      salarioLiquidoCLT, ganhoPJMensal, ganhoMensalExtra,
      contribuicaoINSSMensal, totalINSS, estimativaAposentadoriaINSS,
      contribuicaoPrevidenciaPrivada, acumuladoPrivado
    });
  };

  const f = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const dadosGrafico = resultado ? [
    { name: 'Valor da Ação', valor: resultado.totalAcao, cor: '#ef4444' },
    { name: 'Risco Estimado (68%)', valor: resultado.risco, cor: '#facc15' },
    { name: 'Seguro (15%)', valor: resultado.seguro, cor: '#22c55e' }
  ] : [];

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center">📊 Simulador de Pejotização</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Salário médio:</label>
          <input type="number" value={salario} onChange={e => setSalario(+e.target.value)}
            className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Colaboradores:</label>
          <input type="number" value={colaboradores} onChange={e => setColaboradores(+e.target.value)}
            className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meses:</label>
          <input type="number" value={meses} onChange={e => setMeses(+e.target.value)}
            className="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <button onClick={calcular}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Calcular
      </button>

      {resultado && (
        <div className="space-y-6 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">🏢 Visão da Empresa</h2>
            <p><strong>Custo CLT:</strong> {f(resultado.custoCLT)}</p>
            <p><strong>Custo PJ:</strong> {f(resultado.custoPJ)}</p>
            <p><strong>Economia mensal:</strong> {f(resultado.economiaMensal)}</p>
            <p><strong>Economia total:</strong> {f(resultado.economiaTotal)}</p>
            <p><strong>Economia líquida (após seguro):</strong> {f(resultado.economiaLiquida)}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">🛡️ Gráfico de Risco</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={f} />
                <Tooltip formatter={(v) => f(v)} />
                <Legend />
                <Bar dataKey="valor">
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">👤 Visão do Colaborador (1 colaborador)</h2>
            <p><strong>Salário líquido CLT:</strong> {f(resultado.salarioLiquidoCLT)} / mês</p>
            <p><strong>Ganho líquido PJ:</strong> {f(resultado.ganhoPJMensal)} / mês</p>
            <p><strong>Diferença mensal:</strong> {f(resultado.ganhoMensalExtra)}</p>

            <div className="mt-4">
              <h3 className="text-lg font-medium">📊 Composição do ganho PJ:</h3>
              <p><strong>Receita bruta:</strong> {f(salario)}</p>
              <p><strong>Impostos (6%):</strong> {f((salario * 0.06))}</p>
              <p><strong>Contabilidade:</strong> {f(369)}</p>
              <p><strong>Previdência recebida:</strong> {f(resultado.contribuicaoPrevidenciaPrivada)}</p>
              <p><strong>Ganho líquido real:</strong> {f(resultado.ganhoPJMensal)}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium">🏦 Comparativo de Aposentadoria</h3>
              <p><strong>CLT (INSS):</strong> Contribuição mensal de {f(resultado.contribuicaoINSSMensal)} por 35 anos = {f(resultado.totalINSS)}</p>
              <p><strong>Estimativa de aposentadoria via INSS:</strong> {f(resultado.estimativaAposentadoriaINSS)}</p>
              <p><strong>PJ (Previdência privada):</strong> Acúmulo estimado com {f(resultado.contribuicaoPrevidenciaPrivada)}/mês = <strong>{f(resultado.acumuladoPrivado)}</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
