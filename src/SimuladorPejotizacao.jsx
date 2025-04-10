import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

    const contabilidade = 369 * meses * colaboradores;
    const impostos = (recebivelPJ / colaboradores) * 0.06 * meses * colaboradores;

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

    setResultado({
      custoCLT, custoPJ, economiaMensal, economiaTotal,
      economiaLiquida, ganhoPJ, risco, seguro, totalAcao
    });
  };

  const f = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
            <h2 className="text-xl font-semibold mb-2">👤 Visão do Colaborador</h2>
            <p><strong>Ganho PJ total:</strong> {f(resultado.ganhoPJ)}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">🛡️ Gráfico de Risco</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Valor da Ação', valor: resultado.totalAcao },
                { name: 'Risco Estimado (68%)', valor: resultado.risco },
                { name: 'Seguro (15%)', valor: resultado.seguro }
              ]}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={f} />
                <Tooltip formatter={(v) => f(v)} />
                <Legend />
                <Bar dataKey="valor" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
