import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import "./mmain.css";

function App() {
  // const [count, setCount] = useState(0);
  const [user, setuser] = useState("");
  const socket = useMemo(() => {
    io("http://localhost:8000");
  }, []);
  useEffect(() => {

  }, []);

  const [name, setname] = useState("");
  const [value, setvalue] = useState("");

  const handleInputInputClick = (e) => {
    setvalue(e.target.value);
    // socket.emit('MsgRec' , value);
  };
  const handlebuttoninput = () => {


    setvalue("");
  };
  // const users = prompt('enter username')

  return (
    <>
    <div className="wrap">
    <div className="wrapper">
      </div>
      <div className="inputs">
        <input type="text" /> <button>Join</button>
        <input type="text " /> <button>Send</button>
      </div>
    </div>
    </>
  );
}

export default App;
