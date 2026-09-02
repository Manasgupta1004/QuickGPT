import React from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from '../pages/Loading'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Credits = () => {
  const [plans, setPlans] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const { token, axios } = useAppContext()

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get('/api/credit/plan', {
        headers: {
          Authorization: token
        }
      })
      if (data.success) {
        setPlans(data.plans)
      } else {
        toast.error(data.message || 'Failed to fetch plans')
      }
    } catch (error) {
      toast.error(error)
    }
    setLoading(false)
  }
  const purchasePlan = async (planId) => {
    try {
      const { data } = await axios.post('/api/credit/purchase', { planId }, {
        headers: {
          Authorization: token
        }
      })
      if (data.success) {
        window.location.href = data.url
      } else {
        toast.error(data.message || 'Failed to purchase plan')
      }
    } catch (error) {
      toast.error(error)
    }
  }

  React.useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <div className="text-xl font-semibold mb-6 text-gray-800 dark:text-purple-100">Credits Plans</div>
      <div className='sm:flex items-center justify-center'>
        {plans.map((plan, index) => (
          <div key={index} className='m-4'>
            <div className='bg-purple-200 dark:bg-gray-900 shadow-md rounded-lg p-6 w-64'>
              <h3 className='text-2xl font-semibold'>{plan.name}</h3>
              <div className='flex items-end mt-2 gap-1'>
                <p className='text-2xl text-purple-600'>${plan.price} </p> / {plan.credits} credits
              </div>
              <div>
                <ul className='list-disc font-sm text-sm list-inside mt-3 text-gray-700 dark:text-purple-200'>
                  {plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className='mt-10 flex items-center justify-center'>
                <button className='bg-purple-700 w-full hover:bg-purple-900 text-white font-bold py-2 px-4 rounded'
                  onClick={() => toast.promise(purchasePlan(plan._id), {
                    loading: 'Processing...',
                  })}>
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
