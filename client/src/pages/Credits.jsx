import React from 'react'
import { dummyPlans } from '../assets/assets'

const Credits = () => {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <div className="text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100">Credits Plans</div>
      <div className='sm:flex items-center justify-center'>
        {dummyPlans.map((plan, index) => (
         <div key={index} className='m-4'>
            <div className='bg-purple-200 dark:bg-gray-900 shadow-md rounded-lg p-6 w-64'>
              <h3 className='text-2xl font-semibold'>{plan.name}</h3>
              <div className='flex items-end mt-2 gap-1'>
                <p className='text-2xl text-purple-600'>${plan.price} </p> / {plan.credits} credits
              </div>
              <div>
                <ul className='list-disc font-sm text-sm list-inside mt-3 text-gray-700 dark:text-purple-200'>
                  <li>{plan.features[0]}</li>
                  <li>{plan.features[1]}</li>
                  <li>{plan.features[2]}</li>
                  <li>{plan.features[3]}</li>
                </ul>
              </div>
              <div className='mt-10 flex items-center justify-center'>
                <button className='bg-purple-700 w-full hover:bg-purple-900 text-white font-bold py-2 px-4 rounded'>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits
