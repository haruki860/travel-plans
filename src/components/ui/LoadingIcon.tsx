import TravelIcon from "../../../public/icons/TravelIcon.png";
import { motion } from "framer-motion"; // Framer Motionのインポート
import React from 'react'

export const LoadingIcon: React.FC = () => {
  return (
    <motion.img
    src={TravelIcon}
    alt="Travel Planner"
    style={{ width: "400px" }}
    animate={{ scale: [1, 1.2, 1] }} // 拡大・縮小アニメーション
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} // 1.5秒で繰り返し
  />
  )
}
