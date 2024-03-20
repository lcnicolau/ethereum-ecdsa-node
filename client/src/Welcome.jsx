import server from "./server";

function Welcome({ address, setBalance }) {

  async function claim(address) {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`welcome/${address}`);
      return balance;
    } else {
      return 0;
    }
  }

  async function onSubmit(evt) {
    evt.preventDefault();
    try {
      claim(address).then(balance => setBalance(balance));
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container welcome" onSubmit={onSubmit}>
      <h2>Welcome</h2>
      <label>You will receive 100 coins for trying this app - for free!</label>
      <input type="submit" className="button" value="Claim"/>
    </form>
  );
}

export default Welcome;