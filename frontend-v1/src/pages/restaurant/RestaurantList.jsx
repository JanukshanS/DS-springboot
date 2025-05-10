/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchRestaurants, clearError } from '../../store/slices/restaurantSlice'
import {Restaurant } from './../../services/RestaurantService'
import Button from '../../components/common/Button'
import toast from 'react-hot-toast'
import { restaurant } from '../../services/api'

// export const RestaurantList = () => {
    