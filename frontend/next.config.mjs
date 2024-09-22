/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['react-beautiful-dnd'],
    eslint: {ignoreDuringBuilds: true,},
}
export default nextConfig;
