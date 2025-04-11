import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Legend, Cell, LabelList } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function SimuladorPejotizacao() {
  const [salario, setSalario] = useState(10000);
  const [colaboradores, setColaboradores] = useState(10);
  const [meses, setMeses] = useState(12);
  const [resultado, setResultado] = useState(null);
  const pdfRef = useRef();

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

    const contribuicaoINSSMensal = Math.min(salario * 0.14, 908.86);
    const tempoContribuicao = 35;
    const totalINSS = contribuicaoINSSMensal * 12 * tempoContribuicao;
    const estimativaAposentadoriaINSS = 6500;

    const contribuicaoPrevidenciaPrivada = previdencia / colaboradores;
    const acumuladoPrivado = Array.from({ length: tempoContribuicao * 12 }).reduce(
      (acc) => acc * 1.005 + contribuicaoPrevidenciaPrivada, 0
    );

    setResultado({
      custoCLT, custoPJ, economiaMensal, economiaTotal, economiaLiquida,
      ganhoPJ, risco, seguro, totalAcao, salarioLiquidoCLT, ganhoPJMensal,
      ganhoMensalExtra, contribuicaoINSSMensal, totalINSS,
      estimativaAposentadoriaINSS, contribuicaoPrevidenciaPrivada, acumuladoPrivado
    });
  };

  const gerarPDF = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('relatorio-simulador.pdf');
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
          <label className="block text-sm font-medium mb-1">Salário médio (R$):</label>
          <input type="number" value={salario} onChange={e => setSalario(+e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Número de colaboradores:</label>
          <input type="number" value={colaboradores} onChange={e => setColaboradores(+e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Período de permanência na empresa (meses):</label>
          <input type="number" value={meses} onChange={e => setMeses(+e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>
      </div>

      <button onClick={calcular} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Calcular</button>

      {resultado && (
        <>
          <div ref={pdfRef} className="mt-8 space-y-6">
            <div className="bg-slate-50 p-6 rounded-xl shadow-md border border-slate-200">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">🏢 Visão da Empresa</h2>
              <p><strong>Custo CLT:</strong> {f(resultado.custoCLT)}</p>
              <p><strong>Custo PJ:</strong> {f(resultado.custoPJ)}</p>
              <p><strong>Economia mensal:</strong> {f(resultado.economiaMensal)}</p>
              <p><strong>Economia total:</strong> {f(resultado.economiaTotal)}</p>
              <p><strong>Seguro estimado:</strong> {f(resultado.seguro)}</p>
              <p className="text-green-700 font-semibold"><strong>Economia líquida (com seguro):</strong> {f(resultado.economiaLiquida)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h2 className="text-2xl font-bold text-indigo-800 mb-4">👤 Visão do Colaborador</h2>
              <p><strong>💼 Salário líquido CLT:</strong> {f(resultado.salarioLiquidoCLT)} / mês</p>
              <p><strong>💰 Ganho líquido PJ:</strong> {f(resultado.ganhoPJMensal)} / mês</p>
              <p><strong>📈 Diferença mensal:</strong> {f(resultado.ganhoMensalExtra)}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-amber-700 mb-4">📊 Gráfico de Risco</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosGrafico}>
                  <XAxis dataKey="name" />
                  <Tooltip formatter={f} />
                  <Legend />
                  <Bar dataKey="valor">
                    {dadosGrafico.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.cor} />
                    ))}
                    <LabelList dataKey="valor" formatter={f} position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-emerald-700 mb-4">📘 Comparativo de Aposentadoria</h3>
              <p><strong>Contribuição mensal INSS:</strong> {f(resultado.contribuicaoINSSMensal)}</p>
              <p><strong>Total INSS (35 anos):</strong> {f(resultado.totalINSS)}</p>
              <p><strong>Estimativa de aposentadoria via INSS:</strong> {f(resultado.estimativaAposentadoriaINSS)}</p>
              <p><strong>Acúmulo estimado Previdência Privada:</strong> {f(resultado.acumuladoPrivado)}</p>
            </div>
          </div>

          <div className="text-center">
            <button onClick={gerarPDF} className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              📄 Gerar PDF do Relatório
            </button>
          </div>
        </>
      )}
    </div>
  );
}
