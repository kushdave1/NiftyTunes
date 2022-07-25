import react from 'react'
import {useState, useEffect, useRef} from 'react'

function Countdown({ seconds }) {
  const [tLeft, setTLeft] = useState(seconds);
  const intervalRef = useRef(); // Add a ref to store the interval id

  useEffect(() => {
    
    intervalRef.current = setInterval(() => {
      setTLeft((t) => t - 1);
    }, 1000);
    console.log(seconds, "dsfinsdi")
    return () => clearInterval(intervalRef.current);
  }, [tLeft]);

  // Add a listener to `timeLeft`
  useEffect(() => {
    if (tLeft < 0) {
      clearInterval(intervalRef.current);
      setTLeft(0)
      console.log(tLeft)
    }
  }, [tLeft]);

  return <div>{tLeft}</div>;
}


export default Countdown