import type { NextConfig } from "next";
<<<<<<< HEAD
import path from "path";
import { fileURLToPath } from "url";

/** Turbopack이 상위 폴더의 package-lock.json을 루트로 잡지 않도록 이 프로젝트 폴더를 명시 */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
=======

const nextConfig: NextConfig = {
  /* config options here */
>>>>>>> 591fd6b54b028640e0305966d84a48de2a70a24c
};

export default nextConfig;
