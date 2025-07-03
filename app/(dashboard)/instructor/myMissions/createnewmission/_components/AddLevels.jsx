'use client'

import { useState } from "react"
import Addlevelbtn from "./Addlevelbtn"

export default function AddLevels() {
  const [Level, setLevel] = useState('AddLevel')

  const [levels, setLevels] = useState([
    {
      id: 1,
      title: 'HTML Genesis',
      description: 'Basic concept and overview',
      purpose: 'Alternatives to HTML'
    }
  ])

  const handleAddLevel = () => {
    const newId = levels.length + 1
    setLevels([
      ...levels,
      {
        id: newId,
        title: `Level ${newId} Title`,
        description: 'Basic concept and overview',
        purpose: `Purpose of Level ${newId}`
      }
    ])
  }

  return (
    <>
      {Level === 'AddLevel' && (
        <div
        style={{paddingBottom:'20px'}}
          onClick={() => setLevel('SetAddLevel')}
          className="w-full h-[404.49px] flex items-end justify-center bg-[#0F0F0F] pb-[30px]"
        >
          <div className="w-[90%] h-[247.06px] flexcenter flex-col border border-dashed border-[#696969] gap-5 rounded-[22px] bg-[#131313]">
            <p className="font-[600] text-[21px] bg-[#2E2E2E] h-[30px] w-[30px] flexcenter rounded-full">+</p>
            <p className="font-[600] text-[12px] sm:text-[21px]">Add New Level</p>
          </div>
        </div>
      )}

      {Level === 'SetAddLevel' && (
        <div style={{padding:'10px'}} className="flex flex-col gap-10">
          {levels.map((level) => (
            <div
             style={{padding:'30px'}}
              key={level.id}
              className="w-full h-fit flex flex-col gap-3 bg-[#0F0F0F] shadow-[#696969] px-[30px] py-[20px]"
            >
              <p className="text-[#6F6F6F] font-[600] text-[15px] sm:text-[25px]">
                Level {level.id}:{' '}
                <span className="text-[15px] sm:text-[25px] text-[var(--background)]">
                  {level.title}
                </span>
              </p>
              <p className="text-[#ACACAC] font-[500] text-[12px] sm:text-[24px]">{level.description}</p>

              <div className="flex flex-col gap-5">
                <Addlevelbtn level="1" text={level.title} />
                <Addlevelbtn level="2" text={level.description} />
                {level.purpose && <Addlevelbtn level="3" text={level.purpose} />}
              </div>

              <button
                className="w-full h-[59.76px] rounded-[12px] border border-dashed border-[#696969] text-white py-[15px]"
              >
                + Add Power Capsule
              </button>
            </div>
          ))}

          <button
          style={{padding:'15px'}}
            onClick={handleAddLevel}
            className="w-[90%] self-center border border-dashed border-[#696969] text-white font-semibold py-4 rounded-xl bg-[#131313] hover:bg-[#1f1f1f] transition"
          >
            + Add New Level
          </button>
        </div>
      )}
    </>
  )
}
