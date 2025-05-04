import React from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { addToFavorites, removeFromFavorites, setFavorites } from '../../redux/features/favorites/favoriteSlice'
import { addFavoriteToLocalStorage, getFavoritesFromLocalStorage, removeFavoritesFromLocalStorage } from '../../Utils/localStorage'
import { useEffect } from 'react'

const HeartIcon = ({product}) => {
    const dispatch = useDispatch();
    const favorites = useSelector(state => state.favorites) || []
    const isFavorite = favorites.some((p) => p._id === product._id);

    useEffect(() => {
        const favoritesFromLocalStorage = getFavoritesFromLocalStorage();
        dispatch(setFavorites(favoritesFromLocalStorage));
    }, []);

    const toggleFavorites = () => {
        if (isFavorite) {
            dispatch(removeFromFavorites(product))
            // remove from the localStorage as well
            removeFavoritesFromLocalStorage(product._id)
        } else {
            dispatch(addToFavorites(product))
            // add the product to localStorage as well
            addFavoriteToLocalStorage(product)
        }
    }


  return (
    <div onClick={toggleFavorites} className='absolute top-2 right-5 courser-pointer'>
        {isFavorite ? (
            <FaHeart className='text-pink-500' />
        ) : (
            <FaRegHeart className='text-white' />
        )}
      
    </div>
  )
}

export default HeartIcon

