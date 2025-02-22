import React from 'react';
import FoodCard from '../components/FoodCard';

const Home = () => {
  const vegItems = [
    { id: 1, name: 'Paneer Tikka', price: 150, img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8fDA%3D' },
    { id: 2, name: 'Veg Biryani', price: 120, img: 'https://media.istockphoto.com/id/495184588/photo/indian-pulav-vegetable-rice-veg-biryani-basmati-rice.webp?a=1&b=1&s=612x612&w=0&k=20&c=74nnoEfGLMtHrSCvLd8juywI5Ztlm_9iT00-OCIDqLg=' },
    { id: 5, name: 'Dosa', price: 80, img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGRvc2F8ZW58MHx8MHx8fDA%3D' },
    { id: 6, name: 'Idli', price: 60, img: 'https://media.istockphoto.com/id/638506124/photo/idli-with-coconut-chutney-and-sambhar.webp?a=1&b=1&s=612x612&w=0&k=20&c=d8gjXysHyh4bNkFoFxcdR0TvZVbp7tFaWNvIiFaBIBQ=' },
  ];

  const nonVegItems = [
    { id: 3, name: 'Chicken Curry', price: 200, img: 'https://plus.unsplash.com/premium_photo-1723708871094-2c02cf5f5394?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2hpY2tlbiUyMGN1cnJ5fGVufDB8fDB8fHww' },
    { id: 4, name: 'Fish Fry', price: 180, img: 'https://images.unsplash.com/photo-1565708409704-dd6416e94c20?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D' },
  ];

  return (
    <div className="home">
      <img
        src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
        alt="Food Banner"
        className="banner-img"
      />
      <h1>Order from GoEato</h1>
      <div className="food-section">
        <h2>Veg Delights</h2>
        <div className="food-container">
          {vegItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <div className="food-section">
        <h2>Non-Veg Treats</h2>
        <div className="food-container">
          {nonVegItems.map(item => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;