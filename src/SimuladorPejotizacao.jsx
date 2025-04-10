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
    <div style={{ padding: 24 }}>
      <h1>Simulador de Pejotização</h1>
      <div style={{ marginBottom: 16 }}>
        <label>Salário médio: </label>
        <input type="number" value={salario} onChange={e => setSalario(+e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Colaboradores: </label>
        <input type="number" value={colaboradores} onChange={e => setColaboradores(+e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Meses: </label>
        <input type="number" value={meses} onChange={e => setMeses(+e.target.value)} />
      </div>
      <button onClick={calcular}>Calcular</button>

      {resultado && (
        <div style={{ marginTop: 32 }}>
          <h2>Resultados</h2>
          <p><strong>Custo CLT:</strong> {f(resultado.custoCLT)}</p>
          <p><strong>Custo PJ:</strong> {f(resultado.custoPJ)}</p>
          <p><strong>Economia mensal:</strong> {f(resultado.economiaMensal)}</p>
          <p><strong>Economia total:</strong> {f(resultado.economiaTotal)}</p>
          <p><strong>Ganho PJ total:</strong> {f(resultado.ganhoPJ)}</p>
          <p><strong>Economia líquida (após seguro):</strong> {f(resultado.economiaLiquida)}</p>
          <p><strong>Valor potencial de ação:</strong> {f(resultado.totalAcao)}</p>
          <p><strong>Risco estimado (68%):</strong> {f(resultado.risco)}</p>
          <p><strong>Seguro estimado (15%):</strong> {f(resultado.seguro)}</p>

          <div style={{ marginTop: 32 }}>
            <h3>Gráfico de Risco</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Valor da Ação', valor: resultado.totalAcao },
                { name: 'Risco Estimado', valor: resultado.risco },
                { name: 'Seguro (15%)', valor: resultado.seguro }
              ]}>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={f} />
                <Tooltip formatter={(v) => f(v)} />
                <Legend />
                <Bar dataKey="valor" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
