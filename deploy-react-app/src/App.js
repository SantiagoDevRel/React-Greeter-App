import './App.css';
import React, { useEffect, useState } from 'react';
import {ethers} from "ethers"
import GreeterJson from "./artifacts/contracts/Greeter.sol/Greeter.json"
import Header from './Header';
const greeterAddress = "0x41594af459f73847bEb1d003F3aDe877579e411A"

let id =0;

function App() {
  const [lastMsg, setLastMsg] = useState("")
  const [msgArr, setMsgArr] = useState([])
  const [contract, setContract] = useState(undefined)
  const [provider, setProvider] = useState(undefined)
  const [addressSigner, setAddressSigner] = useState("")
  const [networkName, setNetworkName] = useState("")
  const [connectedToGoerli, setConnectedToGoerli] = useState(false)

  useEffect(()=>{ 
    const init = async()=>{
      //const provider = await detectEthereumProvider();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider._networkPromise //call object that returns the network object (name, chainid etc...)
      network.name === "goerli" ? setConnectedToGoerli(true) : setConnectedToGoerli(false); //check if connected to goerli and setConnected to true
      setNetworkName(network.name)
      setProvider(provider)
      const contract = new ethers.Contract(greeterAddress,GreeterJson.abi, provider);
      setContract(contract)
      requestAccount()
    }
    init()
  },[])

  const getLastMsgFn = async () =>{
    const last = await contract.getMessage()
    setLastMsg(last)
    //console.log("Called getLastMsgFn()",contract.getMessage())
  }

  const getArrMsg = async () =>{
    const arr = await contract.getMessages();
    setMsgArr(arr)
    //console.log("Called getArrMsg()",arr)

  }

  async function requestAccount(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const addressSigner = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAddressSigner(addressSigner)

  }

  const setMsg = async(value) =>{
    await requestAccount() //call requestAccount()
    const signer = await provider.getSigner() //get signer JsonRpcSigner
    const contract = new ethers.Contract(greeterAddress, GreeterJson.abi, signer); //call contract from the signer
    const transaction = await contract.setMessage(value) //setMsg in the contract
    await transaction.wait()
    getLastMsgFn()    
    getArrMsg()  
    //console.log("SetMsg()",value)

  }

  async function onSubmit (event){
    event.preventDefault();
    await setMsg(event.target.msgValue.value)
    setLastMsg(event.target.msgValue.value)
    
  }

  const changeNetwork = async () => {
    try {
      //if (!window.ethereum) throw new Error("No crypto wallet found");
      await window.ethereum.request({
        "id": 1,
        "jsonrpc": "2.0",
        "method": "wallet_switchEthereumChain",
        "params": [
          {
            "chainId": "0x5",
          }
        ]})
    }catch (err) {
      console.log(err);
    }
  };

  const connectMetamask = async () => {
    await changeNetwork();
    document.location.reload(true)
  };

  return (
    <div className="App">
      <Header wallet={addressSigner} network={networkName}/>
        <div>{connectedToGoerli ? (<div><div className='container'>
        <div className='setMsg'>
          <form onSubmit={event=>onSubmit(event)}>
            <input name="msgValue" placeholder='Write your message here'/><br></br>
            <button className='button-29'>Submit</button>
          </form>
        </div>
        
        <div className='getMsg'>
          <button className='button-29' onClick={getLastMsgFn}>Get last message</button>
          <div className='last-msg'>{lastMsg}</div>
        </div>

        <div className='getMsgArr'> 
          <button className='button-29' onClick={getArrMsg}>Get all messages</button>
          <div>{msgArr.map((element)=><div className='check-list' key={id++}><ul><li>{element}</li></ul></div>)}</div>
        </div>

      </div></div>):(<div className='container'><button onClick={()=>connectMetamask()} className='button-29'>Switch to Goerli Network</button></div>)}</div>
      
    </div>
  );

}

export default App;
