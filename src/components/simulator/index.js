function Simulator( { details, steps } ) {

  return (
    <div>
      <h2>
        Details:
      </h2>
      <p>{JSON.stringify(details)}</p>
      <h3>
        Steps: 
      </h3>
        <p>Step count: {steps?.length}</p>
        {steps.map((data, index) => (
          <p key={index}>{JSON.stringify(data)}</p>
        ))}
    </div>
  )
}

export default Simulator;