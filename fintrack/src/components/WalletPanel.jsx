import React from 'react'

export default function WalletPanel({ balances, wallets }){
  return (
    <aside className="wallet-panel card">
      <h3>Tu Cartera</h3>
      <div className="wallet-balance">Saldo actual: <strong>${balances?.current}</strong></div>
      <div className="wallet-available">Saldo disponible: <strong>${balances?.available}</strong></div>
      <h4>Tu Cartera</h4>
      <table style={{width:'100%'}}>
        <tbody>
          {wallets?.map((w,i)=> (
            <tr key={i}><td>{w.category}</td><td style={{textAlign:'right'}}>${w.amount}</td></tr>
          ))}
        </tbody>
      </table>
    </aside>
  )
}
