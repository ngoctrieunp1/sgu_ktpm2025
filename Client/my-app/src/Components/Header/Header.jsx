import React, { useState } from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const Navigate=useNavigate()
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    Navigate(`/searchproduct?q=${searchQuery}`);
  };
  return (
    <div className='header'>
       <section className="food-search text-center">
        <div class="container">
            
            <form action="foods.html" method="POST" onSubmit={handleSearchSubmit} >
                <input type="search" name="search" placeholder="Search for Food.." required   value={searchQuery}
                onChange={handleSearchChange}/>
                <input type="submit" name="submit" value="Search" class="btn btn-primary" />
            </form>

        </div>
    </section>
      <div className="header-content">
            <h2>Explore Our Menu</h2>
            <p>Dive into our curated menu, featuring an exquisite variety of dishes designed to tantalize your taste buds. </p>
            <button>View Menu</button>
        </div>

    </div>
   
  )
}

export default Header