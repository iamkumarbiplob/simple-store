import React, { useState } from 'react'

import Nav from './componants/nav/Nav';
import Footer from './componants/footer/Footer';

function App() {
  const [account, setAccount] = useState("");
  const [balanceOfAccount, setAccountBalance] = useState("");
  return (
    <div>
      <Nav account={account} setAccount={setAccount} balanceOfAccount={balanceOfAccount} setAccountBalance={setAccountBalance} />
      <Footer />
    </div>
  );
}

export default App;
