import React from 'react'

interface cvProps {
    title: string;
}

const Cv = ({ title }: cvProps) => {
  return (
    <div>
        {title}
    </div>
  )
}

export default Cv