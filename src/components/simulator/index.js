import { useEffect, useState } from "react";

function Simulator( { data } ) {
  const [dataList, setDataList] = useState([]);
  const [numberSteps, setNumberSteps] = useState(0);

  useEffect(() => {
    setDataList(data[0]);
  }, [data])

  useEffect(() => {
    if (dataList) {
      setNumberSteps(dataList.length);
    }
  }, [dataList])

  return (
    <h2>
      Steps: {numberSteps}
    </h2>
  )
}

export default Simulator;