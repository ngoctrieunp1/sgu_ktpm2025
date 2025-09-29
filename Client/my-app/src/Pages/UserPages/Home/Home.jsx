import React, { useState } from 'react'
import './Home.css'
import Header from '../../../Components/Header/Header'
import ExploreMenu from '../../../Components/ExploreMenu/ExploreMenu'

import FoodItem from '../../../Components/FoodItem/FoodItem'
function Home() {
  const [category, setcategory] = useState("All")
  return (
    <div>
     <Header/>
     <ExploreMenu category={category} setcategory={setcategory} />
     <FoodItem/>
    </div>
  )
}

export default Home