import TravelIcon from "../../../public/icons/TravelIcon.png";
import { motion } from "framer-motion";
import React from "react";

export const LoadingIcon: React.FC = () => {
  return (
    <motion.img
      src={TravelIcon}
      alt="Travel Planner"
      style={{ width: "400px" }}
      initial={{ opacity: 0, scale: 0.5 }} // 初期状態：透明＆小さい
      animate={{
        opacity: [0, 1, 1], // 透明 -> 可視化
        scale: [0.5, 1.2, 1], // 拡大して戻る
      }}
      transition={{
        duration: 2, // 全体のアニメーションの長さ
        ease: "easeInOut", // 滑らかな効果
        times: [0, 0.5, 1], // 各ステップのタイミング
        repeat: Infinity, // 無限ループ（必要なら削除）
        repeatDelay: 3, // ループ時の遅延
      }}
    />
  );
};
